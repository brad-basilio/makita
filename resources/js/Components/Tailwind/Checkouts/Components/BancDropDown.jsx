"use client"

import { useState } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import General from "../../../../Utils/General";

export default function BancoDropdown({
  bancoNombre = "Banco de Credito",
  cuentaCorriente = {
    tipo: "C. Corriente Soles",
    numero: "0011-0616-0100026049",
  },
  codigoInterbancario = {
    tipo: "C. Código Interbancario",
    numero: "011-0616-0100026049-5",
  },
  logoUrl = "/placeholder.svg?height=40&width=40",
}) {

  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="max-w-md w-full">
      <div className="bg-gray-100 rounded-t-md p-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-800 rounded-md flex items-center justify-center overflow-hidden">
              {logoUrl.includes("placeholder") ? (
                <div className="text-white font-bold text-xl">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
              ) : (
                <img src={logoUrl || "/placeholder.svg"} alt={bancoNombre} className="w-full h-full object-cover" />
              )}
            </div>
            <span className="font-medium text-gray-800 text-base">{General.get('checkout_transfer_name')}</span>
          </div>
          {isOpen ? <ChevronUp className="text-amber-800" /> : <ChevronDown className="text-amber-800" />}
        </div>
      </div>

      {isOpen && (
        <div className="bg-gray-100 rounded-b-md p-4 pt-0 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-amber-800 font-medium text-sm">C. Código Interbancario</p>
              <p className="text-gray-800 font-medium text-sm">{General.get('checkout_transfer_cci')}</p>
            </div>
            {/* <div>
              <p className="text-amber-800 font-medium text-sm">{codigoInterbancario.tipo}</p>
              <p className="text-gray-800 font-medium text-sm">{codigoInterbancario.numero}</p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}