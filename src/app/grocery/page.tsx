
"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, Trash2, CheckCircle2, Circle, 
  Plus, Share2, Download, ShoppingBag, 
  Printer, ArrowRight, PackageOpen
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function GroceryPage() {
  const [list, setList] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    // Generate list from planned recipes
    const planner = JSON.parse(localStorage.getItem("harvest_meal_planner") || "{}");
    
    const allIngredients: any[] = [];
    Object.values(planner).forEach((dayRecipes: any) => {
      dayRecipes.forEach((recipe: any) => {
        if (recipe.details?.ingredients) {
          recipe.details.ingredients.forEach((ing: any) => {
            if (!ing.isAvailable) {
              allIngredients.push({
                name: ing.name,
                quantity: ing.quantity,
                checked: false,
                category: "Produce",
                id: Math.random().toString(36).substr(2, 9)
              });
            }
          });
        }
      });
    });

    // Deduplicate
    const uniqueList = Array.from(new Set(allIngredients.map(a => a.name)))
      .map(name => {
        return allIngredients.find(a => a.name === name);
      });

    setList(uniqueList);
  }, []);

  const toggleItem = (id: string) => {
    setList(list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addItem = () => {
    if (!newItem) return;
    setList([{ name: newItem, checked: false, id: Date.now().toString(), category: "Extra" }, ...list]);
    setNewItem("");
  };

  const clearChecked = () => {
    setList(list.filter(item => !item.checked));
  };

  const updateQuantity = (id: string, newQty: string) => {
    setList(list.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareText = list.map(i => `${i.checked ? ' [x] ' : ' [ ] '} ${i.name} (${i.quantity || '1 unit'})`).join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'My Ingredia Grocery List',
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        alert("List copied to clipboard!");
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("List copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F4]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-headline font-black text-primary">Smart Grocery List</h1>
              <p className="text-muted-foreground font-medium text-lg">AI-synchronized with your meal planner.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full border-primary/20" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
              <Button variant="outline" className="rounded-full border-primary/20" onClick={handlePrint}><Printer className="h-4 w-4" /></Button>
            </div>
          </header>

          <Card className="rounded-[3rem] border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="p-10 border-b border-primary/5 bg-primary/5">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                       <ShoppingBag className="h-7 w-7" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-headline font-bold text-primary">Ingredients to Buy</h2>
                       <p className="text-sm font-medium text-muted-foreground">{list.filter(i => i.checked).length} of {list.length} items purchased</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Input 
                      placeholder="Add custom item..." 
                      className="rounded-full h-12 px-6 border-primary/10 w-full md:w-48"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addItem()}
                      suppressHydrationWarning
                    />
                    <Button onClick={addItem} className="rounded-full bg-primary h-12 w-12 p-0 flex-shrink-0">
                       <Plus className="h-6 w-6" />
                    </Button>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               {list.length > 0 ? (
                 <div className="divide-y divide-primary/5">
                   {list.map((item) => (
                     <div 
                      key={item.id} 
                      className={`group p-8 flex items-center justify-between hover:bg-primary/5 transition-all ${item.checked ? 'bg-muted/30' : ''}`}
                     >
                       <div className="flex items-center gap-6">
                         <Checkbox 
                          checked={item.checked} 
                          onCheckedChange={() => toggleItem(item.id)}
                          className="h-6 w-6 rounded-full border-primary/30 data-[state=checked]:bg-primary"
                         />
                         <div className="space-y-1">
                           <p className={`text-lg font-bold text-primary transition-all ${item.checked ? 'line-through opacity-40' : ''}`}>
                             {item.name}
                           </p>
                           <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/10 text-primary/40">
                               {item.category}
                             </Badge>
                             <Input 
                               className="h-6 w-24 text-[10px] font-black uppercase tracking-widest border-none bg-primary/5 rounded-md px-2 focus-visible:ring-1 focus-visible:ring-primary/20"
                               value={item.quantity || ''}
                               onChange={(e) => updateQuantity(item.id, e.target.value)}
                               placeholder="Quantity"
                               suppressHydrationWarning
                             />
                           </div>
                         </div>
                       </div>
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setList(list.filter(i => i.id !== item.id))}
                        suppressHydrationWarning
                       >
                         <Trash2 className="h-5 w-5" />
                       </Button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-20 text-center space-y-8 bg-white/50">
                    <PackageOpen className="h-16 w-16 text-primary/10 mx-auto" />
                    <div className="space-y-2">
                       <h3 className="text-2xl font-headline font-bold text-primary">List is Empty</h3>
                       <p className="text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">Add recipes to your weekly planner to automatically generate your smart grocery list.</p>
                    </div>
                    <Link href="/planner">
                      <Button className="rounded-full bg-primary font-black uppercase text-xs tracking-[0.2em] px-10 h-14">
                        Go to Planner <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                 </div>
               )}
            </CardContent>
            {list.some(i => i.checked) && (
              <div className="p-8 border-t bg-primary/5 flex justify-center">
                 <Button variant="ghost" className="text-destructive font-black uppercase text-[10px] tracking-widest" onClick={clearChecked}>
                    Clear Purchased Items
                 </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
