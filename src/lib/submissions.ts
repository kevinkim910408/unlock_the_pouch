import { getDb } from "@/lib/mongodb";
import { CampaignSubmission, ProvinceStat } from "@/types/campaign";

const SUBMISSIONS_COLLECTION = "submissions";

export async function insertSubmission(submission: CampaignSubmission) {
  const db = await getDb();
  const result = await db
    .collection<CampaignSubmission>(SUBMISSIONS_COLLECTION)
    .insertOne(submission);
  return result.insertedId.toString();
}

export async function getRecentSubmissions(limit = 200) {
  const db = await getDb();
  return db
    .collection<CampaignSubmission>(SUBMISSIONS_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getSubmissionStats() {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const [total, mpCount, provinceStats] = await Promise.all([
    collection.countDocuments(),
    collection.countDocuments({ mpSelected: true }),
    collection
      .aggregate<ProvinceStat>([
        { $group: { _id: "$province", count: { $sum: 1 } } },
        { $project: { _id: 0, province: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  return {
    total,
    mpCount,
    provinceStats,
  };
}
