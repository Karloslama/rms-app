"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useProductStore, useAuthStore } from "@/lib/store";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";

const Header = () => {
  const { products } = useProductStore();
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();

  const lowStockCount = useMemo(() => {
    return products.filter((product) => product.stock <= product.minStock)
      .length;
  }, [products]);

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products, transactions..."
            className="pl-10 w-96"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {lowStockCount > 0 && (
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h -5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {lowStockCount}
            </Badge>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <div className="text-sm text-muted-foreground">
          Welcome back,{" "}
          <span className="font-medium text-foreground">{user?.name}</span>
        </div>
      </div>
    </header>
  );
};
export default Header;
