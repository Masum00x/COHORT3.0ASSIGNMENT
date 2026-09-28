import { useEffect, useState } from 'react'
import { useAuth } from './useAuth.js'
import { productApi } from './api.js'
import Products from './Products.jsx'

const EMPTY_PRODUCT = {
  title: '',
  description: '',
  amount: '',
  currency: 'INR',
  sizes: [{ size: 'M', stock: '1' }],
}

function productFormData(values, files) {
  const formData = new FormData()
  formData.append('title', values.title.trim())
  formData.append('description', values.description.trim())
  formData.append('price', JSON.stringify({ amount: Number(values.amount), currency: values.currency }))
  const sizes = values.sizes.filter((entry) => entry.size).map((entry) => ({
    size: entry.size,
    stock: Number(entry.stock) || 0,
  }))
  formData.append('sizes', JSON.stringify(sizes))
  for (const file of files) formData.append('images', file)
  return formData
}

function productId(product) {
  return product._id || product.id
}

function AuthForm({ onClose }) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('user')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'register') await register({ ...form, role })
      else await login({ email: form.email, password: form.password })
      onClose()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <button className="icon-button dialog-close" type="button" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">YOUR SNITCH ACCOUNT</p>
        <h2 id="auth-title">{mode === 'login' ? 'Welcome back.' : 'Make room for good things.'}</h2>
        <p className="dialog-copy">{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Create an account to shop, or open a seller studio.'}</p>
        <div className="auth-tabs" role="tablist" aria-label="Account action">
          <button className={mode === 'login' ? 'selected' : ''} type="button" onClick={() => { setMode('login'); setError('') }}>Sign in</button>
          <button className={mode === 'register' ? 'selected' : ''} type="button" onClick={() => { setMode('register'); setError('') }}>Create account</button>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          {mode === 'register' && <>
            <label>Full name<input autoComplete="name" minLength="2" maxLength="50" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <fieldset className="role-fieldset">
              <legend>I’m here to</legend>
              <div className="role-options">
                <button className={role === 'user' ? 'role-option chosen' : 'role-option'} type="button" onClick={() => setRole('user')}>Shop</button>
                <button className={role === 'seller' ? 'role-option chosen' : 'role-option'} type="button" onClick={() => setRole('seller')}>Sell</button>
              </div>
            </fieldset>
          </>}
          <label>Email address<input autoComplete="email" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Password<input autoComplete={mode === 'login' ? 'current-password' : 'new-password'} type="password" minLength="6" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-dark button-full" disabled={busy} type="submit">{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}<span aria-hidden="true">↗</span></button>
        </form>
      </section>
    </div>
  )
}

function ProductEditor({ product, onClose, onSaved }) {
  const { token } = useAuth()
  const [values, setValues] = useState(() => product ? {
    title: product.title || '',
    description: product.description || '',
    amount: product.price?.amount ?? '',
    currency: product.price?.currency || 'INR',
    sizes: product.sizes?.length ? product.sizes.map(({ size, stock }) => ({ size, stock: String(stock ?? 0) })) : EMPTY_PRODUCT.sizes,
  } : EMPTY_PRODUCT)
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function updateSize(index, key, value) {
    setValues((current) => ({
      ...current,
      sizes: current.sizes.map((entry, entryIndex) => entryIndex === index ? { ...entry, [key]: value } : entry),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const data = productFormData(values, files)
      if (product) await productApi.update(productId(product), data, token)
      else await productApi.create(data, token)
      await onSaved()
      onClose()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="editor-dialog" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <div className="dialog-heading">
          <div><p className="eyebrow">SELLER STUDIO / INVENTORY</p><h2 id="editor-title">{product ? 'Edit piece' : 'Add a piece'}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="form-stack" onSubmit={handleSubmit}>
          <label>Product name<input required minLength="2" maxLength="50" pattern="[A-Za-z ]+" title="Use letters and spaces only" value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value })} /></label>
          <label>Story<textarea required minLength="20" maxLength="500" rows="4" value={values.description} onChange={(event) => setValues({ ...values, description: event.target.value })} /></label>
          <div className="field-row">
            <label>Price<input type="number" min="0.01" step="0.01" required value={values.amount} onChange={(event) => setValues({ ...values, amount: event.target.value })} /></label>
            <label>Currency<select value={values.currency} onChange={(event) => setValues({ ...values, currency: event.target.value })}><option value="INR">INR / ₹</option><option value="USD">USD / $</option></select></label>
          </div>
          <fieldset className="sizes-fieldset">
            <legend>Size and available stock</legend>
            {values.sizes.map((entry, index) => <div className="size-row" key={index}>
              <select aria-label={`Size ${index + 1}`} value={entry.size} onChange={(event) => updateSize(index, 'size', event.target.value)}>{['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => <option key={size}>{size}</option>)}</select>
              <input aria-label={`Stock for size ${index + 1}`} type="number" min="0" value={entry.stock} onChange={(event) => updateSize(index, 'stock', event.target.value)} />
              <button className="text-button remove-size" type="button" aria-label="Remove size" onClick={() => setValues({ ...values, sizes: values.sizes.filter((_, row) => row !== index) })}>Remove</button>
            </div>)}
            <button className="text-button add-size" type="button" onClick={() => setValues({ ...values, sizes: [...values.sizes, { size: 'M', stock: '0' }] })}>+ Add size</button>
          </fieldset>
          <label>Product photos<input type="file" accept="image/*" multiple disabled={Boolean(product)} onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 5))} /><span className="field-hint">{product ? 'The current server update endpoint does not save new images.' : 'Up to 5 images, 5 MB each.'}</span></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="dialog-actions"><button className="button button-quiet" type="button" onClick={onClose}>Cancel</button><button className="button button-dark" type="submit" disabled={busy || !values.sizes.length}>{busy ? 'Saving…' : product ? 'Save changes' : 'Publish listing'}<span aria-hidden="true">↗</span></button></div>
        </form>
      </section>
    </div>
  )
}

function App() {
  const { user, token, isSeller, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [editorProduct, setEditorProduct] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [activeView, setActiveView] = useState('shop')
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')

  async function loadProducts() {
    setLoading(true)
    setLoadError('')
    try {
      const result = await productApi.list()
      setProducts(Array.isArray(result.product) ? result.product : [])
    } catch (requestError) {
      setLoadError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    productApi.list()
      .then((result) => {
        if (!cancelled) setProducts(Array.isArray(result.product) ? result.product : [])
      })
      .catch((requestError) => {
        if (!cancelled) setLoadError(requestError.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const inventory = activeView === 'studio' && isSeller
    ? products.filter((product) => {
      const owner = typeof product.seller === 'object' ? product.seller?._id : product.seller
      return Boolean(owner && user?.id && String(owner) === String(user.id))
    })
    : products

  async function handleDelete(product) {
    if (!window.confirm(`Delete “${product.title}”? This cannot be undone.`)) return
    setNotice('')
    try {
      await productApi.remove(productId(product), token)
      setNotice('Listing deleted.')
      await loadProducts()
    } catch (requestError) {
      setNotice(requestError.message)
    }
  }

  async function handleLogout() {
    try { await logout() } catch { /* The local session is cleared even if the server is unreachable. */ }
    setActiveView('shop')
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Snitch home">snitch<span>.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={activeView === 'shop' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setActiveView('shop')}>Discover</button>
          {isSeller && <button className={activeView === 'studio' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setActiveView('studio')}>Seller studio</button>}
        </nav>
        <div className="header-tools">
          <label className="search-control"><span aria-hidden="true">⌕</span><input aria-label="Search products" placeholder="Find something" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>/</kbd></label>
          {user ? <div className="account-control"><span className="user-greeting">Hi, {user.name?.split(' ')[0]}</span><button className="account-button" type="button" onClick={handleLogout}>Sign out</button></div> : <button className="account-button" type="button" onClick={() => setAuthOpen(true)}>Sign in <span aria-hidden="true">↗</span></button>}
        </div>
      </header>

      <main id="top">
        <section className="intro-band">
          <div className="intro-copy"><p className="eyebrow">A GOOD FIND, EVERY TIME</p><h1>Objects with<br /><em>a point of view.</em></h1><p className="intro-description">Independent finds for the everyday. Picked with care, made to be kept.</p></div>
          <div className="intro-aside"><span className="orbit-mark">s<span>.</span></span><p>THE THINGS<br />WE KEEP</p><span className="intro-count">COLLECTION / {products.length.toString().padStart(2, '0')}</span></div>
          <div className="intro-bottom"><span>NEW PERSPECTIVES, EVERY DAY</span><span>SCROLL TO EXPLORE ↓</span></div>
        </section>

        <Products
          products={inventory}
          loading={loading}
          error={loadError}
          activeView={activeView}
          isSeller={isSeller}
          query={query}
          notice={notice}
          onDismissNotice={() => setNotice('')}
          onRetry={loadProducts}
          onAdd={() => { setEditorProduct(null); setEditorOpen(true) }}
          onEdit={(product) => { setEditorProduct(product); setEditorOpen(true) }}
          onDelete={handleDelete}
        />

        <footer className="site-footer"><a className="wordmark" href="#top">snitch<span>.</span></a><p>Good things find their people.</p><span>© {new Date().getFullYear()} SNITCH OBJECTS</span></footer>
      </main>
      {authOpen && <AuthForm onClose={() => setAuthOpen(false)} />}
      {editorOpen && <ProductEditor product={editorProduct} onClose={() => setEditorOpen(false)} onSaved={loadProducts} />}
    </div>
  )
}

export default App
