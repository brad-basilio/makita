import React from "react"
import Header from "./Header";
import Footer from "./Footer";
import TopBar from "./TopBar";



const Base = ({ children, summary, socials, generals }) => {
  return <>
    <TopBar socials={socials} />
    <Header socials={socials} generals={generals} />
    <main className="overflow-hidden min-h-[360px]">
      {children}
    </main>
    <Footer summary={summary} socials={socials} generals={generals} />
   
  </>
}

export default Base
