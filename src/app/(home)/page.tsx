import { Button } from "@/components/ui/button";
import { RightPanel } from "../components/RightPanel";
import { SideBar } from "../components/SideBar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div >
      {/* <SideBar /> */}
      <main className="flex flex-col items-center justify-center space-y-4 p-4">
      <Button>Hello World</Button>
      <Label htmlFor="r1">Default</Label>
      <Input placeholder="Type here..." />
      <Progress value={50} />
      <Textarea placeholder="Type here..." />
      <Checkbox id="checkbox" />
      <RadioGroup defaultValue="comfortable">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1">Default</Label>
      </div>
      </RadioGroup>
      
      </main>
     
      {/* <RightPanel /> */}
    </div>
  );
}
