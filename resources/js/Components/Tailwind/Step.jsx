import React from "react"

const StepSimple = React.lazy(() => import('./Steps/StepSimple'))

const Step = ({ which, data }) => {
  const getStep = () => {
    switch (which) {
      case 'StepSimple':
        return <StepSimple data={data} />
      default:
        return <div className="w-full max-w-6xl p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getStep()
}

export default Step