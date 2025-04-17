import React from "react"



const ForgotPasswordSimple = React.lazy(() => import('./ForgotPassword/ForgotPasswordSimple'))
const ForgotBananaLab = React.lazy(() => import('./ForgotPassword/ForgotBananaLab'))
const ForgotPassword = ({ data, which }) => {
    const getForgotPassword = () => {
        switch (which) {

            case 'ForgotPasswordSimple':
                return <ForgotPasswordSimple data={data} />
                case 'ForgotBananaLab':
                    return <ForgotBananaLab data={data} />
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getForgotPassword()
}

export default ForgotPassword;