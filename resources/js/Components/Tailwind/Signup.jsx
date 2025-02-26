import React from "react"



const SignUpSimple = React.lazy(() => import('./Signup/SignUpSimple'))

const Signup = ({ data, which }) => {
    const getSignup = () => {
        switch (which) {

            case 'SignUpSimple':
                return <SignUpSimple data={data} />
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getSignup()
}

export default Signup;