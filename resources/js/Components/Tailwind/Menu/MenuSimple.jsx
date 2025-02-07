import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const MenuSimple = ({ pages = [], items }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])






    return (

        <nav className="bg-secondary font-font-secondary font-normal text-sm" >
            <div className="px-primary mx-auto ">
                <ul className="flex items-center gap-6 text-sm" ref={menuRef}>
                    <li className="relative py-3" >
                        <button className="flex items-center gap-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            Categorias
                            <ChevronDown width={"1rem"} />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute z-50 top-10 left-0 bg-white shadow-lg border-t rounded-xl transition-all duration-200 ease-in-out min-w-[900px] w-auto max-w-7xl">
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {items.map((category, index) => (
                                            <div key={index}>
                                                <h3 className="customtext-neutral-dark font-bold text-sm mb-3 cursor-pointer">{category.name}</h3>
                                                <ul className="space-y-2">
                                                    {category.subcategories.map((item, itemIndex) => (
                                                        <li key={itemIndex}>
                                                            <a href="#" className="customtext-neutral-light text-sm hover:customtext-primary transition-colors duration-200">
                                                                {item.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                    </li>
                    {pages.map((page, index) => (
                        <li key={index} className="py-3">
                            <a href={page.url} className="hover:customtext-primary">
                                {page.name}
                            </a>
                        </li>
                    ))}


                </ul>
            </div>
        </nav >
    )
}
export default MenuSimple;