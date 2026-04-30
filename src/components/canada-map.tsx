"use client";

import { useMemo, useState } from "react";
import { mapjson, populationCanada } from "@/lib/canada-map-data";
import Text from "@/components/text";
import { CampaignLanguage, ProvinceStat } from "@/types/campaign";

type CalcData = {
  _id: string;
  count: number;
  population: number;
  calculatedValue: number;
};

const numberFmt = (value: number) => value.toLocaleString();

const colorRanges = [
  { bg: "#e0e0e0", text: "0" },
  { bg: "#E8F5E9", text: "1 - 500" },
  { bg: "#C8E6C9", text: "501 - 1000" },
  { bg: "#A5D6A7", text: "1001 - 1500" },
  { bg: "#81C784", text: "1501 - 2000" },
  { bg: "#66BB6A", text: "2001 - 2500" },
  { bg: "#4CAF50", text: "2501 - 3000" },
  { bg: "#43A047", text: "3001 - 3500" },
  { bg: "#2E7D32", text: "3501 - 4000" },
  { bg: "#1B5E20", text: "4001 - 4500" },
  { bg: "#0D3D12", text: "4500+" },
];

const rankColors = [
  { bg: "#0D3D12", text: "Rank: 1" },
  { bg: "#2E7D32", text: "Rank: 2" },
  { bg: "#66BB6A", text: "Rank: 3" },
];

const submissionColor = (count: number) => {
  if (count === 0) return "#e0e0e0";
  if (count >= 4501) return "#0D3D12";
  if (count >= 4001) return "#1B5E20";
  if (count >= 3501) return "#2E7D32";
  if (count >= 3001) return "#43A047";
  if (count >= 2501) return "#4CAF50";
  if (count >= 2001) return "#66BB6A";
  if (count >= 1501) return "#81C784";
  if (count >= 1001) return "#A5D6A7";
  if (count >= 501) return "#C8E6C9";
  return "#E8F5E9";
};

type CanadaMapProps = {
  language: CampaignLanguage;
  provinceStats: ProvinceStat[];
};

const PROVINCE_CODE_TO_NAME: Record<string, string> = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon",
};

function normalizeProvinceName(value: string) {
  const trimmed = value.trim();
  const upper = trimmed.toUpperCase();
  return PROVINCE_CODE_TO_NAME[upper] ?? trimmed;
}

export default function CanadaMap({ language, provinceStats }: CanadaMapProps) {
  const [toggle, setToggle] = useState(false);
  const isFr = language === "fr";

  const sortedData = useMemo(() => {
    const byName = new Map<string, number>();

    provinceStats.forEach((row) => {
      const provinceName = normalizeProvinceName(row.province);
      byName.set(provinceName, (byName.get(provinceName) ?? 0) + row.count);
    });

    const allProvinces = populationCanada.map((p) => p.name);
    return allProvinces
      .map((name) => ({
        _id: name,
        count: byName.get(name) ?? 0,
      }))
      .sort((a, b) => a._id.localeCompare(b._id));
  }, [provinceStats]);

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
      .sort((a, b) => a._id.localeCompare(b._id));
  }, [sortedData]);

  const rankByProvince = useMemo(() => {
    const ranked = [...calculatedData]
      .filter((row) => row.count > 0)
      .sort((a, b) => b.calculatedValue - a.calculatedValue);
    const rankMap = new Map<string, number>();
    ranked.forEach((row, index) => {
      rankMap.set(row._id, index + 1);
    });
    return rankMap;
  }, [calculatedData]);

  const getMapFill = (provinceName: string) => {
    if (!toggle) {
      return submissionColor(mapByProvince.get(provinceName) ?? 0);
    }
    const rank = rankByProvince.get(provinceName);
    if (!rank) return "#e0e0e0";
    if (rank === 1) return "#0D3D12";
    if (rank === 2) return "#2E7D32";
    if (rank === 3) return "#66BB6A";
    return "#e0e0e0";
  };

  return (
    <section className="mx-auto w-full max-w-[1200px] px-5 pb-12 md:px-8">
      <div className="flex flex-wrap justify-center gap-1">
        <button
          onClick={() => setToggle(false)}
          className={`px-2 py-1.5 md:min-w-[140px] md:px-4 md:py-2 ${!toggle ? "bg-[#1da8df] text-white" : "bg-[#dddddd] text-[#444]"}`}
        >
          <Text
            as="span"
            size="xs"
            className="text-[10px] font-bold uppercase md:text-xs"
          >
            {isFr ? "Soumissions" : "Submissions"}
          </Text>
        </button>
        <button
          onClick={() => setToggle(true)}
          className={`min-w-[128px] px-2 py-1.5 md:min-w-[170px] md:px-4 md:py-2 ${toggle ? "bg-[#1da8df] text-white" : "bg-[#dddddd] text-[#444]"}`}
        >
          <Text
            as="span"
            size="xs"
            className="text-[10px] font-bold uppercase md:text-xs"
          >
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
                    <th className="py-2 text-right">
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
                          {rankByProvince.get(row._id) ?? "-"}
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
          <div className="absolute left-2 top-2">
            {(toggle ? rankColors : colorRanges).map((range) => (
              <div key={range.text} className="flex items-center gap-1">
                <span
                  className="block h-2.5 w-2.5 border border-[#bcbcbc]"
                  style={{ backgroundColor: range.bg }}
                />
                <Text
                  as="span"
                  size="xs"
                  className="text-[10px] font-semibold leading-none text-[#444]"
                >
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
