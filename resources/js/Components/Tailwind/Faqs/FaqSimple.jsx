import { Plus, Minus } from "lucide-react"
import { useState } from "react"

const FaqSimple = () => {


    const faqs = [
        {
            id: 1,
            question: "Donec in pulvinar sem. Fusce condimentum orci eget metus ullamcorper?",
            answer: "",
        },
        {
            id: 2,
            question: "Donec in pulvinar sem. Fusce condimentum orci eget metus ullamcorper?",
            answer: "",
        },
        {
            id: 3,
            question: "Donec in pulvinar sem. Fusce condimentum orci eget metus ullamcorper?",
            answer: "",
        },
        {
            id: 4,
            question: "Cras faucibus odio sem, vel pellentesque velit accumsan ut?",
            answer:
                "Curabitur vitae nisl felis. Sed vel luctus nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam ultricies sapien mauris, a consectetur sapien posuere eu.",
        },
        {
            id: 5,
            question: "Cras faucibus odio sem, vel pellentesque velit accumsan ut?",
            answer: "",
        },
        {
            id: 6,
            question: "Cras faucibus odio sem, vel pellentesque velit accumsan ut?",
            answer: "",
        },
    ]


    const [expandedFaqs, setExpandedFaqs] = useState(new Set([4])) // FAQ 4 starts expanded


    const toggleFaq = (id) => {
        const newExpanded = new Set(expandedFaqs)
        if (newExpanded.has(id)) {
            newExpanded.delete(id)
        } else {
            newExpanded.add(id)
        }
        setExpandedFaqs(newExpanded)
    }



    return (
        <section className="container mx-auto px-4 mb-16">
            <h1 className="text-4xl font-bold text-center mb-4">Preguntas frecuentes</h1>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eu fermentum justo, ac fermentum nulla. Sed
                sed scelerisque urna, vitae ultricies libero. Pellentesque vehicula et urna in venenatis.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {faqs.map((faq) => (
                    <div
                        key={faq.id}
                        className="bg-white rounded-lg shadow-sm p-6 cursor-pointer"
                        onClick={() => toggleFaq(faq.id)}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-medium pr-8">{faq.question}</h3>
                            <button className="text-blue-500 flex-shrink-0">
                                {expandedFaqs.has(faq.id) ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </button>
                        </div>
                        {expandedFaqs.has(faq.id) && faq.answer && <p className="mt-4 text-gray-600">{faq.answer}</p>}
                    </div>
                ))}
            </div>
        </section>
    )
}
export default FaqSimple;