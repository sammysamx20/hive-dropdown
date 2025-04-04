'use client'
import React, { useState } from "react";
import Dropdown from "./components/dropdown";

export default function Home() {
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  const [selectedSingle, setSelectedSingle] = useState<string[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold">Hive Dropdown Component</h1>
      <div className="flex  flex-row items-center p-2">
        <div>
          <span>Single Select: </span>
          <Dropdown
            items={['Orange', 'Apple', 'Kiwi']}
            selectedItems={selectedMulti}
            onSelect={(selectedItems) => setSelectedMulti(selectedItems as string[])}
            isMulti={false}
            clearable={true}
          />
        </div>

        <div>
          <span>Multi Select: </span>
          <Dropdown
            items={['Orange', 'Apple', 'Kiwi','banana','berry','blackberry','blood orange','blueberry','boysenberry','breadfruit']}
            selectedItems={selectedSingle}
            onSelect={(selectedItems) => setSelectedSingle(selectedItems as string[])}
            isMulti
            clearable={true}
          />
        </div>

      </div>
    </main>
  );
}
