import type { MetaFunction } from "@remix-run/node";
// import Map from "components/Map";

export const meta: MetaFunction = () => {
  return [
    { title: "Travel Map" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <div className="">
    </div>
  );
}
