import React from "react"



const SignupSimple = React.lazy(() => import('./Signup/SignupSimple'))

const Signup = ({ data, which }) => {
    const getSignup = () => {
        switch (which) {

            case 'SignupSimple':
                return <SignupSimple data={data} />
            default:
                return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
        }
    }
    return getSignup()
}

export default Signup;