import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    return (
        <div className="w-full h-full flex flex-col">
            <Header/>

            <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-col w-3/10 border shadow">
                    <Input
                    className="h-10"
                    type="text"
                    />
                    <Button
                    className="h-10"
                    />
                </div>
            </div>

            <Footer/>
        </div>
    )
}