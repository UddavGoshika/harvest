"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle, Calendar, Plus, ShoppingBasket, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface PantryItem {
  id: string;
  name: string;
  addedAt: string;
  expiryDate: string;
  quantity: string;
}

export default function PantryPage() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", days: "7" });
  const { toast } = useToast();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("harvest_pantry") || "[]");
    setItems(saved);
  }, []);

  const addItem = () => {
    if (!newItem.name) return;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + parseInt(newItem.days));
    
    const item: PantryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItem.name,
      addedAt: new Date().toISOString(),
      expiryDate: expiry.toISOString(),
      quantity: "1 unit"
    };
    
    const updated = [item, ...items];
    setItems(updated);
    localStorage.setItem("harvest_pantry", JSON.stringify(updated));
    setNewItem({ name: "", days: "7" });
    toast({ title: "Item Added", description: `${item.name} is now tracked.` });
  };

  const removeItem = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem("harvest_pantry", JSON.stringify(updated));
  };

  const getExpiryStatus = (date: string) => {
    const daysLeft = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysLeft < 0) return { label: "Expired", color: "text-destructive", progress: 100 };
    if (daysLeft < 3) return { label: `${daysLeft} days left`, color: "text-destructive", progress: 80 };
    if (daysLeft < 7) return { label: `${daysLeft} days left`, color: "text-amber-500", progress: 40 };
    return { label: `${daysLeft} days left`, color: "text-primary", progress: 10 };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-headline font-black text-primary">Fridge Tracker</h1>
              <p className="text-muted-foreground text-lg">Monitor ingredient freshness and reduce waste.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/">
                <Button className="rounded-full bg-primary font-bold shadow-lg">
                  Rescue Expiring Items
                </Button>
              </Link>
            </div>
          </div>

          <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
            <CardHeader className="p-8 bg-primary/5">
              <CardTitle className="font-headline text-2xl text-primary">Add New Ingredient</CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid md:grid-cols-3 gap-4">
              <Input 
                placeholder="Ingredient name..." 
                value={newItem.name} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                className="rounded-xl border-primary/10"
              />
              <Input 
                type="number" 
                placeholder="Days until expiry" 
                value={newItem.days} 
                onChange={(e) => setNewItem({...newItem, days: e.target.value})}
                className="rounded-xl border-primary/10"
              />
              <Button onClick={addItem} className="rounded-xl bg-primary h-12 font-bold" suppressHydrationWarning>
                Track Item
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            {items.map((item) => {
              const status = getExpiryStatus(item.expiryDate);
              return (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-primary/5 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <ShoppingBasket className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-headline font-bold text-primary">{item.name}</h3>
                        <Badge variant="outline" className={`text-[10px] font-bold ${status.color} uppercase`}>
                          {status.label}
                        </Badge>
                      </div>
                      <Progress value={status.progress} className="h-1.5 w-full md:w-64" />
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                    suppressHydrationWarning
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              );
            })}
            {items.length === 0 && (
              <div className="text-center py-20 bg-primary/5 rounded-[3rem] border-2 border-dashed border-primary/10">
                <Calendar className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium">No ingredients tracked yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";