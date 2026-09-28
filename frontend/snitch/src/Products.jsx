function ProductCard({ product, canManage, onEdit, onDelete }) {
    const image = product.images?.[0]
    const price = product.price || {}
    const symbol = price.currency === 'USD' ? '$' : '₹'

    return (
        <article className="product-card">
            <div className="product-image-wrap">
                {image ? <img className="product-image" src={image} alt={product.title} loading="lazy" /> : <div className="image-placeholder"><span>SNITCH OBJECTS</span><span className="placeholder-mark">S.</span></div>}
                {canManage && <div className="product-actions"><button type="button" onClick={onEdit}>Edit</button><button className="delete-action" type="button" onClick={onDelete}>Delete</button></div>}
            </div>
            <div className="product-info"><div><p className="product-kicker">{product.sizes?.map((item) => item.size).filter(Boolean).join(' / ') || 'ONE OF A KIND'}</p><h3>{product.title}</h3></div><p className="product-price">{symbol}{Number(price.amount || 0).toLocaleString('en-IN')}</p></div>
            <p className="product-description">{product.description}</p>
        </article>
    )
}

export default function Products({
    products,
    loading,
    error,
    activeView,
    isSeller,
    query,
    notice,
    onDismissNotice,
    onRetry,
    onAdd,
    onEdit,
    onDelete,
}) {
    const normalizedQuery = query.trim().toLowerCase()
    const visibleProducts = normalizedQuery
        ? products.filter((product) => `${product.title} ${product.description}`.toLowerCase().includes(normalizedQuery))
        : products

    return (
        <section className="catalog-section" aria-labelledby="catalog-title">
            <div className="catalog-heading">
                <div>
                    <p className="eyebrow">THE CURRENT EDIT</p>
                    <h2 id="catalog-title">{activeView === 'studio' ? 'Your listings' : 'Worth a closer look'}<span className="result-count">{visibleProducts.length.toString().padStart(2, '0')}</span></h2>
                </div>
                <div className="catalog-tools">
                    {isSeller && activeView === 'studio' && <button className="button button-dark" type="button" onClick={onAdd}><span aria-hidden="true">＋</span> Add listing</button>}
                    <span className="sort-label">CURATED GOODS / {new Date().getFullYear()}</span>
                </div>
            </div>
            {notice && <div className="notice" role="status">{notice}<button type="button" aria-label="Dismiss message" onClick={onDismissNotice}>×</button></div>}
            {error && <div className="error-banner" role="alert"><span>We couldn’t reach the catalog.</span> {error}<button type="button" onClick={onRetry}>Try again</button></div>}
            {loading ? <div className="empty-state"><span className="loading-mark">S.</span><p>Finding the good stuff…</p></div> : visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product, index) => <ProductCard key={product._id || product.id || index} product={product} canManage={isSeller && activeView === 'studio'} onEdit={() => onEdit(product)} onDelete={() => onDelete(product)} />)}</div> : <div className="empty-state"><span className="empty-mark">{query ? '⌕' : '—'}</span><h3>{query ? 'Nothing found just yet.' : activeView === 'studio' ? 'Your studio is ready.' : 'The shelves are taking shape.'}</h3><p>{query ? 'Try another search.' : activeView === 'studio' ? 'Add the first piece to your collection.' : 'Come back soon for the next edit.'}</p>{activeView === 'studio' && isSeller && <button className="button button-dark" type="button" onClick={onAdd}>Add your first listing <span aria-hidden="true">↗</span></button>}</div>}
        </section>
    )
}