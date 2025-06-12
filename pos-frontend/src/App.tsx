import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  User,
  Search,
  LogOut,
  Plus,
  Minus,
  CreditCard,
} from 'lucide-react';
import { productService } from './services/api';
import { Product } from './types/product';
import './App.css';

interface CartItem extends Product {
  quantity: number;
}

interface Member {
  id: number;
  memberNumber: string;
  name: string;
  status: 'active' | 'suspended';
  balance: number;
}

interface Order {
  id: string;
  memberId: number | null;
  memberNumber: string | null;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  waiterId: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [memberNumber, setMemberNumber] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(true);
  const [loading, setLoading] = useState(true);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [showPendingOrders, setShowPendingOrders] = useState(false);
  const [skipMemberValidation, setSkipMemberValidation] = useState(false);

  // Simulación de mesero logueado
  const waiter = { id: 1, name: 'Juan Pérez' };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simulación de búsqueda de socio
  const searchMember = () => {
    const member = searchMemberById(memberNumber);
    if (member) {
      setCurrentMember(member);
      setShowMemberModal(false);
    } else {
      alert('Número de socio no encontrado');
    }
  };

  const searchMemberById = (id: string): Member | null => {
    if (id === '1234') {
      return {
        id: 1,
        memberNumber: '1234',
        name: 'Roberto González',
        status: 'active',
        balance: 450.0,
      };
    } else if (id === '5678') {
      return {
        id: 2,
        memberNumber: '5678',
        name: 'María Hernández',
        status: 'active',
        balance: 0,
      };
    }
    return null;
  };

  const categories = [
    'all',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch && product.active === 1;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.id !== productId));
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const processOrder = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const order: Order = {
      id: `ORD-${Date.now()}`,
      memberId: currentMember?.id || null,
      memberNumber: currentMember?.memberNumber || memberNumber || null,
      items: [...cart],
      total: getTotalAmount(),
      status: 'pending',
      createdAt: new Date(),
      waiterId: waiter.id,
    };

    if (!currentMember || skipMemberValidation) {
      // Orden sin socio validado - guardar como pendiente
      setPendingOrders([...pendingOrders, order]);
      alert(
        `Orden guardada como PENDIENTE\nTotal: ${getTotalAmount().toFixed(
          2
        )}\n\n⚠️ IMPORTANTE: Solicitar número de socio antes de cerrar la cuenta`
      );
    } else {
      // Orden con socio validado
      alert(
        `Orden cargada a la cuenta del socio ${
          currentMember.name
        }\nTotal: ${getTotalAmount().toFixed(2)}`
      );
    }

    setCart([]);
    setSkipMemberValidation(false);
  };

  const assignOrderToMember = (orderId: string, member: Member) => {
    setPendingOrders(
      pendingOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              memberId: member.id,
              memberNumber: member.memberNumber,
              status: 'confirmed' as const,
            }
          : order
      )
    );
    alert(`Orden ${orderId} asignada a ${member.name}`);
  };

  const changeMember = () => {
    if (cart.length > 0) {
      if (
        !confirm(
          'Hay productos en el carrito. ¿Desea guardar la orden como pendiente?'
        )
      ) {
        return;
      }
      processOrder();
    }
    setCurrentMember(null);
    setMemberNumber('');
    setShowMemberModal(true);
    setCart([]);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <h2>Cargando sistema...</h2>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Modal de Número de Socio */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="club-header">
              <h1>🏆 Club Deportivo San Agustín</h1>
              <p>Sistema de Punto de Venta</p>
            </div>

            <div className="member-form">
              <h2>Ingrese Número de Socio</h2>
              <input
                type="text"
                placeholder="Ej: 1234"
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchMember()}
                className="member-input"
                autoFocus
              />
              <button onClick={searchMember} className="btn-primary">
                <Search size={20} />
                Buscar Socio
              </button>

              <div className="skip-member-option">
                <button
                  onClick={() => {
                    setShowMemberModal(false);
                    setSkipMemberValidation(true);
                  }}
                  className="btn-skip"
                >
                  Continuar sin número de socio
                  <span className="warning-text">Se pedirá al finalizar</span>
                </button>
              </div>

              <p className="demo-hint">Demo: Prueba con 1234 o 5678</p>
            </div>

            <div className="waiter-info">
              <User size={16} />
              <span>Mesero: {waiter.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🏆 Club Deportivo San Agustín</h1>
            <span className="subtitle">Sistema POS</span>
          </div>

          {currentMember && (
            <div className="member-info">
              <div className="member-details">
                <h3>{currentMember.name}</h3>
                <p>Socio #{currentMember.memberNumber}</p>
                {currentMember.balance > 0 && (
                  <p className="balance-warning">
                    Saldo pendiente: ${currentMember.balance.toFixed(2)}
                  </p>
                )}
              </div>
              <button onClick={changeMember} className="btn-secondary">
                <LogOut size={16} />
                Cambiar Socio
              </button>
            </div>
          )}

          {!currentMember && !showMemberModal && (
            <div className="no-member-warning">
              <span>⚠️ Sin socio asignado</span>
              <button
                onClick={() => setShowMemberModal(true)}
                className="btn-assign-member"
              >
                Asignar Socio
              </button>
            </div>
          )}

          <div className="header-actions">
            {pendingOrders.length > 0 && (
              <button
                onClick={() => setShowPendingOrders(!showPendingOrders)}
                className="btn-pending"
              >
                Órdenes Pendientes ({pendingOrders.length})
              </button>
            )}

            <div className="waiter-section">
              <User size={20} />
              <span>{waiter.name}</span>
            </div>
          </div>
        </div>
      </header>

      {(currentMember || skipMemberValidation) && (
        <div className="pos-container">
          {/* Productos */}
          <div className="products-section">
            {/* Búsqueda y Filtros */}
            <div className="filters">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              <div className="category-filters">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-btn ${
                      selectedCategory === category ? 'active' : ''
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className="btn-add"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Sin Stock' : <Plus size={20} />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito */}
          <div className="cart-section">
            <div className="cart-header">
              <h2>
                <ShoppingCart size={24} />
                Orden Actual
              </h2>
            </div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Carrito vacío</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>${item.price.toFixed(2)} c/u</p>
                    </div>
                    <div className="item-controls">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn-quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="btn-quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <>
                <div className="cart-total">
                  <h3>Total:</h3>
                  <h3>${getTotalAmount().toFixed(2)}</h3>
                </div>

                <button onClick={processOrder} className="btn-charge">
                  <CreditCard size={20} />
                  {currentMember
                    ? 'Cargar a Cuenta del Socio'
                    : 'Guardar Orden (Pendiente de Socio)'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Órdenes Pendientes */}
      {showPendingOrders && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <h2>Órdenes Pendientes de Asignación</h2>

            {pendingOrders
              .filter((o) => o.status === 'pending')
              .map((order) => (
                <div key={order.id} className="pending-order-card">
                  <div className="order-header">
                    <h3>Orden {order.id}</h3>
                    <span>
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-line">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>

                  <div className="order-actions">
                    <input
                      type="text"
                      placeholder="Número de socio"
                      className="member-input-small"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          const member = searchMemberById(input.value);
                          if (member) {
                            assignOrderToMember(order.id, member);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const num = prompt('Ingrese número de socio:');
                        if (num) {
                          const member = searchMemberById(num);
                          if (member) {
                            assignOrderToMember(order.id, member);
                          }
                        }
                      }}
                      className="btn-assign"
                    >
                      Asignar
                    </button>
                  </div>
                </div>
              ))}

            <button
              onClick={() => setShowPendingOrders(false)}
              className="btn-secondary"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
