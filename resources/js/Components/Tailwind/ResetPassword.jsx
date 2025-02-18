import React from "react"



const ResetPasswordSimple = React.lazy(() => import('./ResetPassword/ResetPasswordSimple'))

const ResetPassword = ({ data, which }) => {
    const getResetPassword = () => {
        switch (which) {

            case 'ResetPasswordSimple':
                return <ResetPasswordSimple data={data} />
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getResetPassword()
}

export default ResetPassword;