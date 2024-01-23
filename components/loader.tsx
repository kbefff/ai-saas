import Image from "next/image";

export const Loader = () => {
    return(
        <div className="h-full flex flex-col gap-y-4 items-center justify-center">
            <div className="w-10 h-10 reative animate-spin">
                <Image fill alt="logo" src="/logo.png" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
            </div>
            <p className="text-muted-foreground text-sm text-center">
                Genius is thinking...
            </p>
        </div>
    )
}