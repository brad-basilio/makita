const TopBarSocials = ({ title = 'Sin titulo', socials }) => {
  return <div className="bg-primary py-3 px-primary flex flex-wrap gap-1 justify-between items-center">
    <p>{title}</p>
    <div className="flex gap-4">
      {
        socials.map((social, index) => (
          <a key={index} className="text-xl w-6" href={social.url} target="_blank" rel="noopener noreferrer">
            <i className={social.icon} />
          </a>
        ))
      }
    </div>
  </div>
}

export default TopBarSocials