import { getDb } from "@/lib/mongodb";
import { CampaignSubmission, ProvinceStat } from "@/types/campaign";
import { Filter, ObjectId, Sort } from "mongodb";

const SUBMISSIONS_COLLECTION = "users";
type EmailActionType = "minister_copy" | "mp_copy" | "premier_copy";

export async function insertSubmission(submission: CampaignSubmission) {
  const db = await getDb();
  const submissionNumber = await getNextSubmissionNumber();
  const result = await db
    .collection<CampaignSubmission>(SUBMISSIONS_COLLECTION)
    .insertOne({ ...submission, submissionNumber });
  return result.insertedId.toString();
}

async function getNextSubmissionNumber() {
  const db = await getDb();
  const counter = await db.collection<{ _id: string; seq: number }>("counters").findOneAndUpdate(
    { _id: "submissionNumber" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return Number(counter?.seq ?? 1);
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

type StatsListFilter = "all" | "subscribed" | "unsubscribed";
type StatsListSort = "new" | "old";

export async function getSubmissionsForStats(options?: {
  filter?: StatsListFilter;
  sort?: StatsListSort;
  limit?: number;
}) {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const filter = options?.filter ?? "all";
  const sort = options?.sort ?? "new";
  const limit = options?.limit ?? 500;

  const query: Filter<CampaignSubmission> = {};
  if (filter === "subscribed") {
    query.newsletterOptIn = true;
  }
  if (filter === "unsubscribed") {
    query.newsletterOptIn = false;
  }

  const sortByCreatedAt: Sort = { createdAt: sort === "old" ? 1 : -1 };

  return collection.find(query).sort(sortByCreatedAt).limit(limit).toArray();
}

export async function getSubmissionStats() {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const [total, provinceStats] = await Promise.all([
    collection.countDocuments(),
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
    provinceStats,
  };
}

export async function getTopicSelectionStats() {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  return collection
    .aggregate<{ topicId: string; count: number }>([
      { $unwind: "$topics" },
      { $group: { _id: "$topics", count: { $sum: 1 } } },
      { $project: { _id: 0, topicId: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ])
    .toArray();
}

export async function getImportantTopicStats() {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const [topicStats, variantStats, desiredTopicStats, desiredVariantStats] = await Promise.all([
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$importantTopicIds" },
        { $group: { _id: "$importantTopicIds", count: { $sum: 1 } } },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$importantTopicVariantIds" },
        { $group: { _id: "$importantTopicVariantIds", count: { $sum: 1 } } },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$desiredTopicIds" },
        { $group: { _id: "$desiredTopicIds", count: { $sum: 1 } } },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$desiredTopicVariantIds" },
        { $group: { _id: "$desiredTopicVariantIds", count: { $sum: 1 } } },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  return { topicStats, variantStats, desiredTopicStats, desiredVariantStats };
}

export async function getTemplateUsageStats() {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const [openingStats, endingStats, subjectStats, premierSubjectStats] = await Promise.all([
    collection
      .aggregate<{ key: string; count: number }>([
        {
          $group: {
            _id: { $ifNull: ["$openingTemplateId", "opening-unknown"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        {
          $group: {
            _id: { $ifNull: ["$endingTemplateId", "ending-unknown"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        {
          $group: {
            _id: { $ifNull: ["$subjectLine", "subject-unknown"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        {
          $group: {
            _id: { $ifNull: ["$premierSubjectLine", "premier-subject-unknown"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  return { openingStats, endingStats, subjectStats, premierSubjectStats };
}

type PrintTarget = "all" | "minister" | "mp";
type PrintFilter = "all" | "pending" | "printed";

function buildPrintQuery(options?: {
  target?: PrintTarget;
  status?: PrintFilter;
  query?: string;
  recipient?: string;
}) {
  const target = options?.target ?? "all";
  const status = options?.status ?? "all";
  const queryText = options?.query?.trim();
  const recipient = options?.recipient?.trim();

  const query: Filter<CampaignSubmission> = {};
  if (queryText) {
    const n = Number(queryText);
    if (!Number.isNaN(n)) {
      query.submissionNumber = n;
    } else {
      query.submissionNumber = -1;
    }
  }

  const withLegacyPending = (field: "printStatusMinister" | "printStatusMp") => ({
    $or: [{ [field]: "pending" }, { [field]: { $exists: false } }, { [field]: null }],
  });

  if (target === "minister") {
    if (recipient && !/michel/i.test(recipient)) {
      query.submissionNumber = -1;
      return query;
    }
    if (status === "pending") Object.assign(query, withLegacyPending("printStatusMinister"));
    if (status === "printed") query.printStatusMinister = "printed";
  } else if (target === "mp") {
    query.mpEmail = { $exists: true, $ne: "" };
    if (recipient) {
      query.mpName = { $regex: recipient, $options: "i" };
    }
    if (status === "pending") Object.assign(query, withLegacyPending("printStatusMp"));
    if (status === "printed") query.printStatusMp = "printed";
  } else {
    if (status === "pending") {
      Object.assign(query, {
        $or: [
          { printStatusMinister: "pending" },
          { printStatusMinister: { $exists: false } },
          { printStatusMinister: null },
          { printStatusMp: "pending" },
          { printStatusMp: { $exists: false } },
          { printStatusMp: null },
        ],
      });
    }
    if (status === "printed") {
      Object.assign(query, {
        $or: [{ printStatusMinister: "printed" }, { printStatusMp: "printed" }],
      });
    }
  }

  return query;
}

export async function getPrintSubmissions(options?: {
  target?: PrintTarget;
  status?: PrintFilter;
  query?: string;
  recipient?: string;
  limit?: number;
}) {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const limit = options?.limit ?? 1000;
  const query = buildPrintQuery(options);

  return collection.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function getPrintSubmissionIds(options?: {
  target?: PrintTarget;
  status?: PrintFilter;
  query?: string;
  recipient?: string;
  limit?: number;
}) {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);
  const limit = options?.limit ?? 1000;
  const query = buildPrintQuery(options);
  const rows = await collection.find(query).project({ _id: 1 }).limit(limit).toArray();
  return rows.map((row) => String(row._id));
}

export async function getPrintSubmissionsByIds(ids: string[]) {
  const objectIds = ids
    .map((id) => {
      try {
        return new ObjectId(id);
      } catch {
        return null;
      }
    })
    .filter((id): id is ObjectId => Boolean(id));

  if (objectIds.length === 0) return [];

  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);
  return collection.find({ _id: { $in: objectIds } }).sort({ createdAt: -1 }).toArray();
}

export async function markPrintedBulk(
  ids: string[],
  target: PrintTarget,
  nextStatus: "pending" | "printed",
) {
  const objectIds = ids
    .map((id) => {
      try {
        return new ObjectId(id);
      } catch {
        return null;
      }
    })
    .filter((id): id is ObjectId => Boolean(id));

  if (objectIds.length === 0) {
    return { modifiedCount: 0 };
  }

  const db = await getDb();
  const collection = db.collection(SUBMISSIONS_COLLECTION);
  const now = new Date();

  if (target === "minister") {
    const result = await collection.updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          printStatusMinister: nextStatus,
          printedAtMinister: nextStatus === "printed" ? now : null,
        },
      },
    );
    return { modifiedCount: result.modifiedCount };
  }

  if (target === "all") {
    const ministerResult = await collection.updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          printStatusMinister: nextStatus,
          printedAtMinister: nextStatus === "printed" ? now : null,
        },
      },
    );
    const mpResult = await collection.updateMany(
      { _id: { $in: objectIds }, mpEmail: { $exists: true, $ne: "" } },
      {
        $set: {
          printStatusMp: nextStatus,
          printedAtMp: nextStatus === "printed" ? now : null,
        },
      },
    );
    return { modifiedCount: ministerResult.modifiedCount + mpResult.modifiedCount };
  }

  const result = await collection.updateMany(
    { _id: { $in: objectIds }, printStatusMp: { $ne: "not_applicable" } },
    {
      $set: {
        printStatusMp: nextStatus,
        printedAtMp: nextStatus === "printed" ? now : null,
      },
    },
  );
  return { modifiedCount: result.modifiedCount };
}

export async function recordSubmissionEmailAction(input: {
  submissionId: string;
  actionType: EmailActionType;
  province?: string;
  mpEmail?: string;
  mpName?: string;
  premierEmail?: string;
}) {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(input.submissionId);
  } catch {
    return { ok: false as const, reason: "invalid_submission_id" as const };
  }

  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);
  const result = await collection.updateOne(
    { _id: objectId, "emailActions.actionType": { $ne: input.actionType } },
    {
      $push: {
        emailActions: {
          actionType: input.actionType,
          at: new Date(),
          province: input.province?.trim() || undefined,
          mpEmail: input.mpEmail?.trim() || undefined,
          mpName: input.mpName?.trim() || undefined,
          premierEmail: input.premierEmail?.trim() || undefined,
        },
      },
    },
  );

  if (result.modifiedCount === 1) {
    return { ok: true as const, recorded: true as const };
  }

  const exists = await collection.countDocuments({ _id: objectId }, { limit: 1 });
  if (exists > 0) {
    return { ok: true as const, recorded: false as const };
  }

  return { ok: false as const, reason: "submission_not_found" as const };
}

export async function getEmailActionStats() {
  const db = await getDb();
  const collection = db.collection<CampaignSubmission>(SUBMISSIONS_COLLECTION);

  const [
    peopleSentToMpByMp,
    emailsSentByMp,
    peopleSentToPremierByProvince,
    emailsSentByProvince,
    lettersGeneratedByMp,
  ] = await Promise.all([
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$emailActions" },
        { $match: { "emailActions.actionType": "minister_copy" } },
        {
          $group: {
            _id: {
              submissionId: "$_id",
              mpName: { $ifNull: ["$mpName", "Unknown MP"] },
              mpEmail: { $ifNull: ["$mpEmail", "unknown@email"] },
            },
          },
        },
        {
          $group: {
            _id: {
              $concat: ["$_id.mpName", " (", "$_id.mpEmail", ")"],
            },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$emailActions" },
        { $match: { "emailActions.actionType": "minister_copy" } },
        {
          $group: {
            _id: { $concat: [{ $ifNull: ["$mpName", "Unknown MP"] }, " (", { $ifNull: ["$mpEmail", "unknown@email"] }, ")"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$emailActions" },
        { $match: { "emailActions.actionType": "premier_copy" } },
        {
          $group: {
            _id: {
              submissionId: "$_id",
              province: { $ifNull: ["$emailActions.province", "$province"] },
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.province",
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        { $unwind: "$emailActions" },
        { $match: { "emailActions.actionType": { $in: ["minister_copy", "premier_copy"] } } },
        {
          $group: {
            _id: { $ifNull: ["$emailActions.province", "$province"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
    collection
      .aggregate<{ key: string; count: number }>([
        {
          $group: {
            _id: { $concat: [{ $ifNull: ["$mpName", "Unknown MP"] }, " (", { $ifNull: ["$mpEmail", "unknown@email"] }, ")"] },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, key: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ])
      .toArray(),
  ]);

  return {
    peopleSentToMpByMp,
    emailsSentByMp,
    peopleSentToPremierByProvince,
    emailsSentByProvince,
    lettersGeneratedByMp,
  };
}
