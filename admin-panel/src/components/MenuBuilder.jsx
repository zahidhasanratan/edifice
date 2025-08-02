import React, { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Swal from "sweetalert2";

export const MenuBuilder = () => {
  const [menus, setMenus] = useState([]);

  // Fetch menu from backend
  const fetchMenus = async () => {
    const res = await fetch("http://localhost:5000/api/menus");
    const data = await res.json();
    setMenus(data);
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const saveMenuOrder = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/menus/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menus }),
      });
      if (res.ok) {
        Swal.fire("Success", "Menu order saved!", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save menu order", "error");
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = menus.findIndex((item) => item._id === active.id);
      const newIndex = menus.findIndex((item) => item._id === over.id);
      setMenus((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">Menu Builder</h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={menus.map((m) => m._id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-2">
            {menus.map((menu) => (
              <SortableMenuItem key={menu._id} id={menu._id} menu={menu} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      <button onClick={saveMenuOrder} className="mt-4 btn btn-primary">Save Menu Order</button>
    </div>
  );
};

const SortableMenuItem = ({ id, menu }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 bg-base-200 rounded shadow cursor-move ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="font-semibold">{menu.menu_name}</div>
      {menu.children?.length > 0 && (
        <ul className="mt-2 ml-4 space-y-1">
          {menu.children.map((child) => (
            <li key={child._id} className="p-2 rounded shadow bg-base-100">
              {child.menu_name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};
