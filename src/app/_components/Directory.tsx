"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input"; // Shadcn Input component
import { Badge } from "@/components/ui/badge"; // Shadcn Badge component
import { Card, CardContent, CardTitle } from "@/components/ui/card"; // Shadcn Card components

// Define the type for an individual item
interface Item {
  name: string;
  description: string;
  tags?: string[];
  link?: string;
}

// Define the type for filter options
interface FilterOption {
  label: string;
  value: string;
}

// Define the type for a filter
interface Filter {
  name: string;
  options: FilterOption[];
  type: "checkbox" | "dropdown";
}

// Define the type for the component props
interface DirectoryProps<T extends Item> {
  items: T[];
  filters?: Filter[]; // Optional filters prop
}

// Define the component using generics to enforce type safety
export default function Directory<T extends Item>({
  items,
  filters = [], // Default to an empty array if no filters are provided
}: DirectoryProps<T>) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>(items);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Sorting state

  // Get a unique list of all tags
  const allTags: string[] = [
    ...new Set(items.flatMap((item) => (item.tags ? item.tags : []))),
  ];

  // Update the filtered items based on search term, tags, filters, and sorting order
  useEffect(() => {
    const results = items
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags =
          selectedTags.length === 0 ||
          (item.tags && selectedTags.every((tag) => item.tags!.includes(tag)));

        // Check if item matches all selected filters
        const matchesFilters = filters.every((filter) => {
          if (
            !selectedFilters[filter.name] ||
            selectedFilters[filter.name].length === 0
          ) {
            return true;
          }
          return selectedFilters[filter.name].some((filterValue) =>
            item[filter.name as keyof Item]?.includes(filterValue),
          );
        });

        return matchesSearch && matchesTags && matchesFilters;
      })
      .sort((a, b) => {
        // Sort items based on sortOrder
        if (sortOrder === "asc") {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });

    setFilteredItems(results);
  }, [searchTerm, selectedTags, selectedFilters, items, filters, sortOrder]);

  // Toggle tags in the filter
  const toggleTag = (tag: string) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag],
    );
  };

  // Handle filter change
  const handleFilterChange = (filterName: string, optionValue: string) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (!updatedFilters[filterName]) {
        updatedFilters[filterName] = [];
      }
      if (updatedFilters[filterName].includes(optionValue)) {
        updatedFilters[filterName] = updatedFilters[filterName].filter(
          (val) => val !== optionValue,
        );
      } else {
        updatedFilters[filterName].push(optionValue);
      }
      return updatedFilters;
    });
  };

  // Handle sorting change
  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "asc" | "desc");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search and Tag Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        {/* Search Input */}
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          className="w-full md:w-1/2"
        />
        {/* Tag Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                onClick={() => toggleTag(tag)}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Additional Filter Boxes and Sort Dropdown */}
      {filters.length > 0 || (
        <div className="mb-8 flex flex-wrap items-center gap-4">
          {filters.map((filter) => (
            <div key={filter.name} className="flex flex-col">
              <h3 className="font-bold">{filter.name}</h3>
              {filter.type === "checkbox" &&
                filter.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedFilters[filter.name]?.includes(option.value) ??
                        false
                      }
                      onChange={() =>
                        handleFilterChange(filter.name, option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              {filter.type === "dropdown" && (
                <select
                  value={selectedFilters[filter.name]?.[0] ?? ""}
                  onChange={(e) =>
                    handleFilterChange(filter.name, e.target.value)
                  }
                >
                  <option value="">Select {filter.name}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          {/* Sort Order Dropdown */}
          <div className="flex flex-col">
            <h3 className="font-bold">Sort by Name</h3>
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      )}

      {/* Displaying Filtered Items */}
      <div className="flex flex-col gap-4">
        {filteredItems.map((item) => (
          <Card
            key={item.name}
            className="mb-4 w-full shadow-md hover:shadow-lg"
          >
            <CardContent>
              <CardTitle className="text-xl font-semibold">
                {item.name}
              </CardTitle>
              <p className="text-gray-700">{item.description}</p>
              {/* Display tags only if available */}
              {item.tags && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-blue-500"
                >
                  Visit
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
