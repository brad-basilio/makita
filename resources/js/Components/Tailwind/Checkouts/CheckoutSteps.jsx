import { useState } from "react"
import CartStep from "./Components/CartStep"
import ShippingStep from "./Components/ShippingStep"
import ConfirmationStep from "./Components/ConfirmationStep"


export default function CheckoutSteps({ cart, setCart }) {
    const [currentStep, setCurrentStep] = useState(1)


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Steps indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-3xl mx-auto">
                        <div className={`text-sm ${currentStep === 1 ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                            1. Carrito de compra
                        </div>
                        <div className={`text-sm ${currentStep === 2 ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                            2. Detalles de envío
                        </div>
                        <div className={`text-sm ${currentStep === 3 ? "text-blue-600 font-medium" : "text-gray-600"}`}>
                            3. Orden confirmada
                        </div>
                    </div>
                    <div className="mt-4 h-1 max-w-3xl mx-auto bg-gray-200">
                        <div
                            className="h-1 bg-blue-600 transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Steps content */}
                {currentStep === 1 && <CartStep products={cart} onContinue={() => setCurrentStep(2)} />}

                {currentStep === 2 && <ShippingStep onContinue={() => setCurrentStep(3)} />}

                {currentStep === 3 && <ConfirmationStep products={cart} />}
            </div>
        </div>
    )
}

