const loadingWallet = () => {
    return (
        <>
            {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex flex-1 items-center w-full rounded-md bg-card p-4 h-36">
                    <div className="flex flex-1 animate-pulse space-x-4">
                        <div className="size-12 rounded-xl bg-muted"></div>
                        <div className="flex-1 space-y-6 py-1">
                            <div className="h-2 rounded bg-muted"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-2 h-3 rounded bg-muted"></div>
                                    <div className="col-span-1 h-3 rounded bg-muted"></div>
                                </div>
                                <div className="h-3 rounded bg-muted"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default loadingWallet