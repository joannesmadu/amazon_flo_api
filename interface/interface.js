import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultItems = [
  { name: "Menstrual Pads", asin: "B000XYZ" },
  { name: "Painkillers", asin: "B001XYZ" },
  { name: "Chocolate Snacks", asin: "B002XYZ" },
  { name: "Heating Pad", asin: "B003XYZ" },
  { name: "Tea Bags", asin: "B004XYZ" }
];

export default function Dashboard() {
  const [status, setStatus] = useState("Checking...");
  const [cartDetails, setCartDetails] = useState(null);
  const [customPackage, setCustomPackage] = useState([]);
  const userId = "sample-user-123"; // Replace with actual user ID

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const checkCycle = async () => {
    const response = await fetch(`/check-cycle/${userId}`);
    const data = await response.json();
    setStatus(data.message);
    if (data.cart_details) {
      setCartDetails(data.cart_details);
    }
  };

  const fetchUserPreferences = async () => {
    const response = await fetch(`/get-preferences/${userId}`);
    const data = await response.json();
    if (data.care_package) {
      setCustomPackage(data.care_package);
    }
  };

  const updatePreferences = async () => {
    await fetch(`/set-preferences/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customPackage),
    });
    alert("Preferences updated!");
  };

  const resetPreferences = () => {
    setCustomPackage(defaultItems);
    alert("Preferences reset to default!");
  };

  const addItem = (name, asin) => {
    setCustomPackage([...customPackage, { name, asin }]);
  };

  return (
    <div className="p-4">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">Cycle Status</h2>
          <p>{status}</p>
          <Button onClick={checkCycle} className="mt-2">Check Cycle</Button>
          {cartDetails && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Cart Items:</h3>
              <ul>
                {cartDetails.items.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardContent>
          <h2 className="text-xl font-bold">Customize Care Package</h2>
          {customPackage.map((item, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <Input
                type="text"
                value={item.name}
                onChange={(e) => {
                  const updatedPackage = [...customPackage];
                  updatedPackage[index].name = e.target.value;
                  setCustomPackage(updatedPackage);
                }}
              />
              <Input
                type="text"
                value={item.asin}
                onChange={(e) => {
                  const updatedPackage = [...customPackage];
                  updatedPackage[index].asin = e.target.value;
                  setCustomPackage(updatedPackage);
                }}
              />
            </div>
          ))}
          <h3 className="text-lg font-semibold mt-4">Add Item from List</h3>
          <Select onValueChange={(value) => {
            const selectedItem = defaultItems.find(item => item.asin === value);
            if (selectedItem) addItem(selectedItem.name, selectedItem.asin);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              {defaultItems.map((item, index) => (
                <SelectItem key={index} value={item.asin}>{item.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-4 flex space-x-2">
            <Button onClick={updatePreferences}>Save Preferences</Button>
            <Button onClick={resetPreferences} className="bg-red-500">Reset to Default</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
