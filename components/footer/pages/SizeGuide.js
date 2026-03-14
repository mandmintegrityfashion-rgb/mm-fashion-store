export default function SizeGuide() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#1F2D3D]">Size Guide</h2>
      <p className="mb-4">Find your perfect fit with our size guide below:</p>
      <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 px-4 py-2">Size</th>
            <th className="border border-gray-400 px-4 py-2">Bust (in)</th>
            <th className="border border-gray-400 px-4 py-2">Waist (in)</th>
            <th className="border border-gray-400 px-4 py-2">Hips (in)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">S</td>
            <td className="border px-4 py-2">32-34</td>
            <td className="border px-4 py-2">24-26</td>
            <td className="border px-4 py-2">34-36</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">M</td>
            <td className="border px-4 py-2">35-37</td>
            <td className="border px-4 py-2">27-29</td>
            <td className="border px-4 py-2">37-39</td>
          </tr>
          <tr>
            <td className="border px-4 py-2">L</td>
            <td className="border px-4 py-2">38-40</td>
            <td className="border px-4 py-2">30-32</td>
            <td className="border px-4 py-2">40-42</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
