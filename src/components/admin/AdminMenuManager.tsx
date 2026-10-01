"use client";

import { useState } from "react";
import Image from "next/image";
import { MenuItem } from "@/types";
import { formatCurrency } from "@/lib/settings";
import { Button } from "@/components/ui/Button";
import { AdminMenuItemForm } from "./AdminMenuItemForm";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { getMenuItemImage } from "@/lib/menuImages";

interface AdminMenuManagerProps {
  initialItems: MenuItem[];
}

export function AdminMenuManager({ initialItems }: AdminMenuManagerProps) {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState<MenuItem | null | "new">(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function handleToggleAvailability(item: MenuItem) {
    setTogglingId(item.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !item.is_available, updated_at: new Date().toISOString() })
      .eq("id", item.id);

    if (!error) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, is_available: !item.is_available } : i
        )
      );
    }
    setTogglingId(null);
  }

  function handleSaved(savedItem: MenuItem, isNew: boolean) {
    if (isNew) {
      setItems((prev) => [...prev, savedItem].sort((a, b) => a.sort_order - b.sort_order));
    } else {
      setItems((prev) => prev.map((i) => (i.id === savedItem.id ? savedItem : i)));
    }
    setEditingItem(null);
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setEditingItem("new")} size="sm">
          Add item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center rounded border border-stone-200 bg-white">
          <p className="font-medium text-stone-700">No menu items yet</p>
          <p className="mt-1 text-sm text-stone-400">Add your first item to get started.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-stone-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Item
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 sm:table-cell">
                    Price
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 md:table-cell">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500 lg:table-cell">
                    Order
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const imgUrl = getMenuItemImage(item);
                          return imgUrl ? (
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-stone-100 bg-stone-100">
                              <Image
                                src={imgUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 shrink-0 rounded border border-stone-100 bg-stone-100" />
                          );
                        })()}
                        <div>
                          <p className="font-medium text-stone-900">{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-stone-400 line-clamp-1">
                              {item.description}
                            </p>
                          )}
                          <p className="text-xs text-stone-600 sm:hidden">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 font-medium text-stone-900 sm:table-cell">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      {item.is_available ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="neutral">Unavailable</Badge>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-stone-500 lg:table-cell">
                      {item.sort_order}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAvailability(item)}
                          disabled={togglingId === item.id}
                        >
                          {item.is_available ? "Disable" : "Enable"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editingItem !== null && (
        <AdminMenuItemForm
          item={editingItem === "new" ? null : editingItem}
          onClose={() => setEditingItem(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
}
