import { createContext, ReactNode, useContext, useState } from "react"
import { ShoppingCart } from "../components/ShoppingCart"

type ShoppingCartPrividerProps = {
  children: ReactNode
}

type CartItem = {
  // on a pas besoin du reste des infos ici
  id: number
  quantity: number
}
//pour créer la valeur-type du context il faut se demander de quoi on a besoin dans le contexte?
// on veut pouvoir ajouter des élément, incrémenter, décrementer et supprimer
type ShoppingCartContext = {
  openCart: () => void
  closeCart: () => void
  getItemQuantity: (id: number) => number // on veut pouvoir get la quantity d'un item. ça prendra en param un id qui est un nombre et ça va retourner un nombre
  increaseCartQuantity: (id: number) => void // increase ça prend un id et ça ne retourne rien
  decreaseCartQuantity: (id: number) => void // on veut pouvoir get la quantity d'un item. ça prendra en param un id qui est un nombre et ça va retourner un nombre
  removeFromCart: (id: number) => void // on veut pouvoir get la quantity d'un item. ça prendra en param un id qui est un nombre et ça va retourner un nombre
  cartQuantity: number
  cartItems: CartItem[]
} // on vient de définir le type du ShoppingCartContext mais attention il faut aller créer les fonctions
//crééer le contexte - doner une value au context
const ShoppingCartContext = createContext({} as ShoppingCartContext) // on donne le type qu'on vient de créér au moment de la création du context

//créer le customhook pour utiliser le contexte
export function useShoppingCart() {
  return useContext(ShoppingCartContext)
}

// créer le provider du context et y wrapper les children
//attention a ne pas oublier de créer le type de children qui est toujours un ReactNode

export function ShoppingCartProvider({ children }: ShoppingCartPrividerProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]) //endroit ou on va stocker toutes les infos de notre cart avec un type <CartItems[]>
  const [isOpen, setIsOpen] = useState(false)

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  )

  const openCart = () => {
    setIsOpen(true)
  }
  const closeCart = () => {
    setIsOpen(false)
  }
  function getItemQuantity(id: number) {
    return cartItems.find((item) => item.id === id)?.quantity || 0
  } // notre fonction take in an id (type number) et fait que: prend tout nos cartItems et trouve l'item dont l'item.id match notre id de params. Si tu trouves donne son .quantity sinon retourne null

  function increaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }]
      } else {
        return currItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 }
          } else {
            return item
          }
        })
      }
    })
  }

  function decreaseCartQuantity(id: number) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item) => item.id !== id)
      } else {
        return currItems.map((item) => {
          return { ...item, quantity: item.quantity - 1 }
        })
      }
    })
  }

  function removeFromCart(id: number) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id)
    })
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
        openCart,
        closeCart,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  )
}

//ensuite il faut aller wrapper toute notre application dans le context provider
