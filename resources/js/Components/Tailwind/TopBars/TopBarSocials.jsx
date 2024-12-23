import General from "../../../Utils/General"

const TopBarSocials = ({ items }) => {
  return <section className="bg-primary text-white">
    <div className="px-[5%] replace-max-w-here mx-auto py-3 px-4 flex flex-wrap justify-center md:justify-between items-center gap-2">
      <p className="hidden md:block">{General.get('cintillo')}</p>
      <div className="flex gap-4">
        {
          items.map((social, index) => (
            <a key={index} className="text-xl w-6" href={social.url} target="_blank" rel="noopener noreferrer">
              <i className={social.icon} />
            </a>
          ))
        }
      </div>
    </div>
  </section>
}

export default TopBarSocials