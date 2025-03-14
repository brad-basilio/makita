import { section } from "framer-motion/client";
import { Award, ListChecks, Headphones, Shield } from "lucide-react";

export default function AboutSimple({ data, filteredData }) {
    const { aboutuses, webdetail, strengths } = filteredData;
    const webAboutTitle = webdetail.find(
        (item) => item.name === "title" && item.page === "about"
    );
    console.log(webAboutTitle);
    const sectionOne = aboutuses.find(
        (item) => item.correlative === "section-1-about"
    );
    const sectionTwo = aboutuses.find(
        (item) => item.correlative === "section-2-about"
    );
    const sectionThree = aboutuses.find(
        (item) => item.correlative === "section-3-about"
    );
    const sectionFour = aboutuses.find(
        (item) => item.correlative === "section-4-about"
    );
    return (
        <main className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-16 ">
                <div className="text-center">
                    <span className="customtext-primary font-bold">
                        {webAboutTitle?.description}
                    </span>
                    <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto customtext-neutral-dark">
                        {sectionOne?.title}
                    </h1>

                    <div
                        className="mt-6 customtext-neutral-light max-w-3xl mx-auto text-lg prose"
                        dangerouslySetInnerHTML={{
                            __html: sectionOne?.description,
                        }}
                    />
                </div>
                <div className="mt-12 max-w-5xl mx-auto rounded-2xl overflow-hidden">
                    <img
                        src={`/storage/images/aboutuse/${sectionOne?.image}`}
                        onError={(e) =>
                            (e.target.src = "/api/cover/thumbnail/null")
                        }
                        alt={sectionOne?.title}
                        className="w-full h-[400px] object-cover"
                    />
                </div>
            </section>

            {/* Why Trust Us Section */}
            <section className="px-primary 2xl:px-0 2xl:max-w-7xl mx-auto py-16  bg-[#F7F9FB]">
                <h2 className="text-3xl md:text-[40px] font-bold customtext-neutral-dark">
                    {sectionTwo?.title}
                </h2>
                <div className="mt-12 grid md:grid-cols-2  gap-8">
                    {strengths.map(
                        (item, index) =>
                            item.visible &&
                            item.status && (
                                <FeatureCard
                                    key={index}
                                    icon={item.image}
                                    title={item.name}
                                    description={item.description}
                                />
                            )
                    )}
                </div>
            </section>

            {/* Trust Section */}
            <section className="px-4 py-16 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <img
                            src={`/storage/images/aboutuse/${sectionThree?.image}`}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                            alt={sectionOne?.title}
                            className="w-full h-auto object-cover rounded-2xl"
                        />
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold customtext-neutral-dark">
                                {sectionThree?.title}
                            </h2>
                            <div
                                className="mt-6 customtext-neutral-light max-w-3xl mx-auto text-lg prose"
                                dangerouslySetInnerHTML={{
                                    __html: sectionThree?.description,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Future Section */}
            <section className="px-4 py-16 md:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold customtext-neutral-dark">
                                {sectionFour?.title}
                            </h2>
                            <div
                                className="mt-6 customtext-neutral-light max-w-3xl mx-auto text-lg prose"
                                dangerouslySetInnerHTML={{
                                    __html: sectionFour?.description,
                                }}
                            />
                        </div>
                        <img
                            src={`/storage/images/aboutuse/${sectionFour?.image}`}
                            onError={(e) =>
                                (e.target.src = "/api/cover/thumbnail/null")
                            }
                            alt={sectionOne?.title}
                            className="w-full h-auto object-cover rounded-2xl"
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="group p-6 hover:bg-white rounded-xl  hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12  rounded-xl flex items-center justify-center bg-primary mb-4 p-2">
                <img
                    src={`/storage/images/strength/${icon}`}
                    onError={(e) =>
                        (e.target.src = "/api/cover/thumbnail/null")
                    }
                    alt=""
                    className="w-full h-auto object-cover  grayscale brightness-0 invert"
                />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}
