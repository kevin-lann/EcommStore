
// 1. Add product to localstorage
export const addFavoriteToLocalStorage = (product) => {
    const favorites = getFavoritesFromLocalStorage()
    if(!favorites.some((p)=> p._id === product._id)) {
        favorites.push(product)
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
}

// 2. Remove product from localStorage
export const removeFavoriteFromLocalStorage = (productId) => {
    const favorites = getFavoritesFromLocalStorage()
    const updateFavorites = favorites.filter(
        (product) => product._id !== productId
    )

    localStorage.setItem("favorites", JSON.stringify(updateFavorites))
}

// 3. Retrieve favorites from localstorage
export const getFavoritesFromLocalStorage = () => {
    const favoritesJSON = localStorage.getItem('favorites')
    return favoritesJSON ? JSON.parse(favoritesJSON) : []
}
