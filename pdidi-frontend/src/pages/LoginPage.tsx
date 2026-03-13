import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    return (

            <div className="flex flex-1 justify-center items-center">
                <div className="flex flex-col w-3/10 border shadow p-12">
                    <div>
                        <Label className="mb-2">Initial</Label>
                        <Input
                        className="h-10 mb-4"
                        type="text"
                        placeholder="e.g. EV25-1"
                        />
                    </div>
                    <Button
                    className="h-10"
                    />
                </div>
            </div>
    )
}