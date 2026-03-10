import MatchedJobsClient from "./MatchedJobsClient";

type MatchedJobsPageProps = {
  searchParams: {
    skill?: string;
  };
};

export default function MatchedJobsPage({ searchParams }: MatchedJobsPageProps) {
  const skill = typeof searchParams.skill === "string" ? searchParams.skill : "";

  return <MatchedJobsClient skill={skill} />;
}