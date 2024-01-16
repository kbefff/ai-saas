import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { UserButton } from "@clerk/nextjs"

const Navbar = () => {
    return (
        <div className="flext items-center p-4">
            <Button variant="ghost" size="icon" className="Md:hidden">
                <Menu />
            </Button>
            <UserButton afterSignOutUrl="/" />
            <div></div>
        </div>
    )
}

export default Navbar