// HistoryTab.tsx
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useMemo, useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, Layout } from "react-native-reanimated";

/* ------------------------------------------------------------------ */
/* Types & Sample Data                                                */
/* ------------------------------------------------------------------ */

export type HistoryCategory =
  | "all"
  | "medication"
  | "grooming"
  | "walk"
  | "vet";

export type HistoryEvent = {
  id: string;
  title: string;
  subtitle: string;
  category: Exclude<HistoryCategory, "all">;
  at: Date;
  // icon + tint
  icon: keyof typeof Ionicons.glyphMap;
  tint: string; // soft bg (tile)
  tintDot: string; // small dot color
  // meta
  location?: string;
  distanceMiles?: number;
  photos?: number;
  hasPhoto?: boolean;
  note?: string; // quoted note bubble
  resultPanel?: string[]; // green panel lines
  metaLabel?: string; // e.g. "Report saved"
};

const now = new Date();
const days = (d: number) =>
  new Date(now.getFullYear(), now.getMonth(), now.getDate() + d);

const seed: HistoryEvent[] = [
  {
    id: "e1",
    title: "Heartworm Prevention",
    subtitle: "Monthly pill administered",
    category: "medication",
    at: new Date(days(0).setHours(8, 30)),
    icon: "bandage-outline",
    tint: "#FFF3E7",
    tintDot: "#FB923C",
    hasPhoto: true,
  },
  {
    id: "e2",
    title: "Morning Walk",
    subtitle: "30 minutes in Central Park",
    category: "walk",
    at: new Date(days(0).setHours(7, 0)),
    icon: "footsteps-outline",
    tint: "#EAF3FF",
    tintDot: "#3B82F6",
    distanceMiles: 1.2,
  },
  {
    id: "e3",
    title: "Nail Trimming",
    subtitle: "All four paws trimmed",
    category: "grooming",
    at: new Date(days(-1).setHours(14, 15)),
    icon: "cut-outline",
    tint: "#EAF0FF",
    tintDot: "#60A5FA",
    note: "“Buddy was very cooperative today. No stress during the trimming session.”",
  },
  {
    id: "e4",
    title: "Vitamin Supplement",
    subtitle: "Joint health supplement",
    category: "medication",
    at: new Date(days(-1).setHours(8, 0)),
    icon: "medkit-outline",
    tint: "#F4EBFF",
    tintDot: "#A855F7",
  },
  {
    id: "e5",
    title: "Vet Checkup",
    subtitle: "Annual wellness exam",
    category: "vet",
    at: new Date(days(-3).setHours(10, 30)),
    icon: "medkit",
    tint: "#FFECEC",
    tintDot: "#EF4444",
    resultPanel: ["All tests came back normal", "Weight: 65 lbs (ideal range)"],
    metaLabel: "Report saved",
  },
  {
    id: "e6",
    title: "Full Grooming",
    subtitle: "Bath, brush, and ear cleaning",
    category: "grooming",
    at: new Date(days(-4).setHours(15, 0)),
    icon: "sparkles-outline",
    tint: "#EEF2FF",
    tintDot: "#6366F1",
    photos: 3,
  },
];

/* ------------------------------------------------------------------ */

function formatTime(d: Date) {
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function relBucket(d: Date): "TODAY" | "YESTERDAY" | "THIS WEEK" {
  const t = new Date();
  const diffDays = Math.floor(
    (new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "TODAY";
  if (diffDays === 1) return "YESTERDAY";
  return "THIS WEEK";
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function PetHistory({
  petName = "Moon",
  avatar = "https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=256&auto=format&fit=crop",
  rangeLabel = "Last 30 days",
  data = seed,
}: {
  petName?: string;
  avatar?: string;
  rangeLabel?: string;
  data?: HistoryEvent[];
}) {
  const [filter, setFilter] = useState<HistoryCategory>("all");

  const chips: {
    key: HistoryCategory;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
  }[] = [
    { key: "all", label: "All" },
    { key: "medication", label: "Medication", icon: "bandage-outline" },
    { key: "grooming", label: "Grooming", icon: "cut-outline" },
    { key: "walk", label: "Walks", icon: "footsteps-outline" },
    { key: "vet", label: "Vet", icon: "medkit" },
  ];

  const filtered = useMemo(
    () => (filter === "all" ? data : data.filter((e) => e.category === filter)),
    [data, filter]
  );

  const sections = useMemo(() => {
    const groups: Record<string, HistoryEvent[]> = {};
    filtered
      .slice()
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .forEach((e) => {
        const k = relBucket(e.at);
        groups[k] = groups[k] ? [...groups[k], e] : [e];
      });
    return Object.entries(groups).map(([title, items]) => ({
      title,
      data: items,
    }));
  }, [filtered]);

  const completedCount = filtered.length;
  const onTimeRate = "100%"; // placeholder (wire to real SLA later)

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(150)}>
      {/* Small identity row (under your existing screen header) */}
      <View style={styles.identityRow}>
        <Image source={avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.identityTitle}>{petName}'s History</Text>
          <Text style={styles.identitySub}>{rangeLabel}</Text>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.chipsRow}>
        {chips.map((c, i) => {
          const active = c.key === filter;
          return (
            <Pressable
              key={c.key}
              onPress={() => setFilter(c.key)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && { opacity: 0.9 },
                i === 0 && { marginLeft: 0 },
              ]}
            >
              {c.icon && (
                <Ionicons
                  name={c.icon}
                  size={15}
                  color={active ? "#fff" : "#374151"}
                  style={{ marginRight: 6 }}
                />
              )}
              <Text style={[styles.chipText, active && { color: "#fff" }]}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Sections */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 28 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 60).springify()}
            layout={Layout.springify()}
            style={{ paddingHorizontal: 16 }}
          >
            <HistoryCard event={item} />
          </Animated.View>
        )}
        ListFooterComponent={
          <Animated.View entering={FadeInDown.delay(80).springify()}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>This Month's Summary</Text>
              <View style={styles.summaryRow}>
                <View style={styles.summaryCell}>
                  <Text style={styles.summaryBig}>{completedCount}</Text>
                  <Text style={styles.summaryLabel}>Tasks Completed</Text>
                </View>
                <View style={styles.summaryCell}>
                  <Text style={[styles.summaryBig, { color: "#10B981" }]}>
                    {onTimeRate}
                  </Text>
                  <Text style={styles.summaryLabel}>On-time Rate</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        }
      />
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/* Item Card                                                           */
/* ------------------------------------------------------------------ */

function HistoryCard({ event }: { event: HistoryEvent }) {
  return (
    <View style={styles.card}>
      {/* Title row */}
      <View style={styles.titleRow}>
        <View style={styles.leftTitle}>
          <View style={[styles.tile, { backgroundColor: event.tint }]}>
            <Ionicons name={event.icon} size={18} color="#374151" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.cardSub}>{event.subtitle}</Text>
          </View>
        </View>

        <View style={styles.doneRight}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
      </View>

      {/* Optional note panel */}
      {!!event.note && (
        <View style={styles.noteBubble}>
          <Text style={styles.noteText}>{event.note}</Text>
        </View>
      )}

      {/* Optional results panel */}
      {!!event.resultPanel?.length && (
        <View style={styles.resultPanel}>
          {event.resultPanel.map((line, idx) => (
            <View key={idx} style={styles.resultRow}>
              <Ionicons name="checkmark" size={14} color="#10B981" />
              <Text style={styles.resultText}>{line}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Meta row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text style={styles.metaText}>{formatTime(event.at)}</Text>
        </View>

        {event.location && <View style={styles.dotSep} />}

        {event.location && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text style={styles.metaText}>{event.location}</Text>
          </View>
        )}

        {typeof event.distanceMiles === "number" && (
          <>
            <View style={styles.dotSep} />
            <View style={styles.metaItem}>
              <Ionicons name="footsteps-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{event.distanceMiles} miles</Text>
            </View>
          </>
        )}

        {event.hasPhoto && (
          <>
            <View style={styles.dotSep} />
            <View style={styles.metaItem}>
              <Ionicons name="image-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>Photo attached</Text>
            </View>
          </>
        )}

        {typeof event.photos === "number" && event.photos > 0 && (
          <>
            <View style={styles.dotSep} />
            <View style={styles.metaItem}>
              <Ionicons name="image-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText}>{event.photos} photos</Text>
            </View>
          </>
        )}

        {!!event.metaLabel && (
          <>
            <View style={styles.dotSep} />
            <View style={styles.metaItem}>
              <Ionicons
                name="document-text-outline"
                size={14}
                color="#6B7280"
              />
              <Text style={styles.metaText}>{event.metaLabel}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const PALETTE = {
  text: "#0F172A",
  sub: "#6B7280",
  line: "#EEF2FF",
  card: "#FFFFFF",
  chipBg: "#F3F4F6",
  chipActiveA: "#7C3AED",
  chipActiveB: "#6D28D9",
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10 },
  identityTitle: { fontWeight: "900", color: PALETTE.text, fontSize: 18 },
  identitySub: { color: PALETTE.sub, marginTop: 2 },

  chipsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PALETTE.chipBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: PALETTE.chipActiveA,
  },
  chipText: { fontWeight: "800", color: "#374151" },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    fontWeight: "900",
    color: "#6B7280",
    letterSpacing: 0.4,
  },

  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.line,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 12,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  leftTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tile: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontWeight: "800", color: PALETTE.text, fontSize: 18 },
  cardSub: { color: PALETTE.sub, marginTop: 4, fontSize: 15 },
  doneRight: { paddingLeft: 8, paddingTop: 2 },

  noteBubble: {
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#F5F7FB",
  },
  noteText: { color: "#475569" },

  resultPanel: {
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  resultText: { color: "#065F46", fontWeight: "700" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { color: "#6B7280", fontWeight: "600" },
  dotSep: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },

  summaryCard: {
    marginTop: 6,
    marginHorizontal: 16,
    backgroundColor: "#F7F7FF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ECECFF",
  },
  summaryTitle: { fontWeight: "900", color: PALETTE.text, marginBottom: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryCell: { alignItems: "center", flex: 1 },
  summaryBig: { fontSize: 28, fontWeight: "900", color: "#2563EB" },
  summaryLabel: { color: PALETTE.sub, marginTop: 4 },
});
