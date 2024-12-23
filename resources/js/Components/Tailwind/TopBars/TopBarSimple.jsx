import General from "../../../Utils/General"

const TopBarSimple = ({ }) => {
  return <div className="bg-primary py-3 px-primary flex justify-center items-center">
    <p>{General.get('cintillo')}</p>
  </div>
}

export default TopBarSimple