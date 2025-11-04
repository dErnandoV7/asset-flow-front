"use client"

import { useAppContext } from "@/app/context/dataContext"

interface Loading {
    className?: string
}

const Loading = ({ className }: Loading) => {
    const { state } = useAppContext()

    return (
        <>
            {state.loading && (
                <div className={`absolute w-screen h-screen bg-[#0000007a] backdrop-blur-[1px] z-100 ${className}`}>
                    <div className="flex justify-center items-center h-full">
                        <div className="border-primary border-2 border-r-transparent w-14 h-14 rounded-full animate-spin ">
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Loading