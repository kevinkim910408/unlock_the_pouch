"use client";

import { useMemo, useState } from "react";
import { createMockProvinceCounts, mapjson, populationCanada } from "@/lib/canada-map-data";
import Text from "@/components/text";
import { CampaignLanguage } from "@/types/campaign";

type CalcData = {
  _id: string;
  count: number;
  population: number;
  calculatedValue: number;
};

const numberFmt = (value: number) => value.toLocaleString();

const colorRanges = [
  { bg: "#ffffff", text: "0" },
  { bg: "#ffcccc", text: "1 - 2,999" },
  { bg: "#ff8080", text: "3,000 - 5,999" },
  { bg: "#ff4d4d", text: "6,000 - 8,999" },
  { bg: "#ff1919", text: "9,000 - 11,999" },
  { bg: "#c50505", text: "12,000 - 14,999" },
  { bg: "#800000", text: "15,000 +" },
];

const rankColors = [
  { bg: "#ff4d4d", text: "Rank: 1" },
  { bg: "#ff8080", text: "Rank: 2" },
  { bg: "#ffcccc", text: "Rank: 3" },
];

const submissionColor = (count: number) => {
  if (count >= 15000) return "#800000";
  if (count >= 12000) return "#c50505";
  if (count >= 9000) return "#ff1919";
  if (count >= 6000) return "#ff4d4d";
  if (count >= 3000) return "#ff8080";
  if (count >= 1) return "#ffcccc";
  return "#ffffff";
};

type CanadaMapProps = {
  language: CampaignLanguage;
};

export default function CanadaMap({ language }: CanadaMapProps) {
  const [toggle, setToggle] = useState(false);
  const isFr = language === "fr";

  const sortedData = useMemo(() => {
    return createMockProvinceCounts().sort((a, b) => b.count - a.count);
  }, []);

  const mapByProvince = useMemo(() => {
    const dictionary = new Map<string, number>();
    sortedData.forEach((item) => dictionary.set(item._id, item.count));
    return dictionary;
  }, [sortedData]);

  const calculatedData: CalcData[] = useMemo(() => {
    return sortedData
      .map((item) => {
        const population = populationCanada.find((p) => p.name === item._id)?.ppl ?? 0;
        return {
          _id: item._id,
          count: item.count,
          population,
          calculatedValue: population ? (item.count / population) * 100 : 0,
        };
      })
      .sort((a, b) => b.calculatedValue - a.calculatedValue);
  }, [sortedData]);

  const rankedIds = useMemo(() => calculatedData.map((d) => d._id), [calculatedData]);

  const getMapFill = (provinceName: string) => {
    if (!toggle) {
      return submissionColor(mapByProvince.get(provinceName) ?? 0);
    }
    const rank = rankedIds.indexOf(provinceName);
    if (rank === 0) return "#ff4d4d";
    if (rank === 1) return "#ff8080";
    if (rank === 2) return "#ffcccc";
    return "#ffffff";
  };

  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 pb-12 md:px-8">
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setToggle(false)}
          className={`px-4 py-2 ${!toggle ? "bg-[#1da8df] text-white" : "bg-[#dddddd] text-[#444]"}`}
        >
          <Text as="span" size="xs" className="font-bold uppercase">
            {isFr ? "Soumissions" : "Submissions"}
          </Text>
        </button>
        <button
          onClick={() => setToggle(true)}
          className={`px-4 py-2 ${toggle ? "bg-[#1da8df] text-white" : "bg-[#dddddd] text-[#444]"}`}
        >
          <Text as="span" size="xs" className="font-bold uppercase">
            {isFr ? "Soumissions vs Population" : "Submissions vs Population"}
          </Text>
        </button>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <Text as="h3" size="md" className="font-black uppercase text-[#3b3b3b]">
            {!toggle
              ? isFr
                ? "Lettres envoyees par province"
                : "Letters Sent by Province"
              : isFr
                ? "Soumissions vs Population"
                : "Submissions vs Population"}
          </Text>

          <table className="mt-5 w-full text-left">
            {!toggle ? (
              <>
                <thead>
                  <tr className="text-[#666]">
                    <th className="py-2 pr-2">
                      <Text as="span" size="xs">
                        {isFr ? "Province" : "Province"}
                      </Text>
                    </th>
                    <th className="py-2">
                      <Text as="span" size="xs">
                        {isFr ? "Soumissions" : "Submissions"}
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((row) => (
                    <tr key={row._id}>
                      <td className="py-2 pr-2">
                        <Text as="span" size="xs" className="font-semibold">
                          {row._id.toUpperCase()}
                        </Text>
                      </td>
                      <td className="py-2 text-right">
                        <Text as="span" size="xs">
                          {numberFmt(row.count)}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            ) : (
              <>
                <thead>
                  <tr className="text-[#666]">
                    <th className="py-2 pr-2">
                      <Text as="span" size="xs">
                        {isFr ? "Province" : "Province"}
                      </Text>
                    </th>
                    <th className="py-2 pr-2">
                      <Text as="span" size="xs">
                        {isFr ? "Rang" : "Rank"}
                      </Text>
                    </th>
                    <th className="py-2 pr-2">
                      <Text as="span" size="xs">
                        {isFr ? "Soumissions" : "Submissions"}
                      </Text>
                    </th>
                    <th className="py-2">
                      <Text as="span" size="xs">
                        {isFr ? "Population*" : "Population*"}
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {calculatedData.map((row, i) => (
                    <tr key={row._id}>
                      <td className="py-2 pr-2">
                        <Text as="span" size="xs" className="font-semibold">
                          {row._id.toUpperCase()}
                        </Text>
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <Text as="span" size="xs">
                          {i + 1}
                        </Text>
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <Text as="span" size="xs">
                          {numberFmt(row.count)}
                        </Text>
                      </td>
                      <td className="py-2 text-right">
                        <Text as="span" size="xs">
                          {numberFmt(row.population)}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            )}
          </table>

          {toggle ? (
            <Text as="p" size="xs" className="mt-2 text-[#777]">
              {isFr
                ? "* base sur la population du T1 2024"
                : "* based on Q1 2024 stat can population"}
            </Text>
          ) : null}
        </div>

        <div className="relative min-h-[360px] rounded-sm bg-[#efefef] p-4">
          <div className="absolute left-4 top-4 space-y-2">
            {(toggle ? rankColors : colorRanges).map((range) => (
              <div key={range.text} className="flex items-center gap-2">
                <span
                  className="block h-4 w-4 border border-[#bcbcbc]"
                  style={{ backgroundColor: range.bg }}
                />
                <Text as="span" size="xs" className="font-semibold text-[#444]">
                  {range.text}
                </Text>
              </div>
            ))}
          </div>

          <div className="pt-20">
            <svg
              className="h-auto w-full overflow-visible"
              viewBox="0 0 900 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(450 250) scale(1.8) translate(-400 -150)">
                {mapjson.map((item) => (
                  <path
                    key={item.id}
                    d={item.d}
                    className="map-path"
                    style={{ fill: getMapFill(item.name) }}
                  >
                    <title>{item.name}</title>
                  </path>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
