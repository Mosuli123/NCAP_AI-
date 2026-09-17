import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge, Card, Chip, EmptyState, SearchBar } from '@/components/ui';
import { FavouriteButton } from '@/components/FavouriteButton';
import { careers, providers, qualifications } from '@/data';
import { colors, spacing, typography } from '@/theme';
import type { Career, Provider, Qualification } from '@/types';

type DirTab = 'careers' | 'qualifications' | 'providers';

const DEMAND_COLORS = { High: colors.success, Medium: colors.info, Low: colors.textMuted };

/**
 * Explore tab hosts the three NCAP directories with mobile-friendly search and
 * filters. A segmented control switches between Careers, "What to Study" and
 * "Where to Study". Deep links from Home pre-select a tab via ?tab=.
 */
export default function ExploreScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ tab?: DirTab }>();
  const [tab, setTab] = useState<DirTab>(params.tab ?? 'careers');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const tabs: { key: DirTab; label: string }[] = [
    { key: 'careers', label: t('home.careers') },
    { key: 'qualifications', label: t('home.qualifications') },
    { key: 'providers', label: t('home.providers') },
  ];

  const switchTab = (key: DirTab) => {
    setTab(key);
    setQuery('');
    setFilter(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {tabs.map((tb) => (
          <Chip key={tb.key} label={tb.label} selected={tb.key === tab} onPress={() => switchTab(tb.key)} />
        ))}
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder={
            tab === 'careers'
              ? t('explore.searchCareers')
              : tab === 'qualifications'
                ? t('explore.searchQualifications')
                : t('explore.searchProviders')
          }
        />
      </View>

      {tab === 'careers' && <CareerList query={query} filter={filter} setFilter={setFilter} />}
      {tab === 'qualifications' && <QualificationList query={query} filter={filter} setFilter={setFilter} />}
      {tab === 'providers' && <ProviderList query={query} filter={filter} setFilter={setFilter} />}
    </View>
  );
}

function FilterRow({ options, active, onSelect }: { options: string[]; active: string | null; onSelect: (v: string | null) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.filters}>
      <Chip label={t('common.all')} selected={active === null} onPress={() => onSelect(null)} />
      {options.map((o) => (
        <Chip key={o} label={o} selected={active === o} onPress={() => onSelect(active === o ? null : o)} />
      ))}
    </View>
  );
}

function CareerList({ query, filter, setFilter }: { query: string; filter: string | null; setFilter: (v: string | null) => void }) {
  const { t } = useTranslation();
  const demandOptions = ['High', 'Medium', 'Low'];
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return careers.filter((c) => {
      const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.tags.some((tg) => tg.includes(q));
      const matchesFilter = !filter || c.demandOutlook === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<FilterRow options={demandOptions} active={filter} onSelect={setFilter} />}
      ListEmptyComponent={<EmptyState message={t('explore.noResults')} />}
      contentContainerStyle={styles.list}
      renderItem={({ item }: { item: Career }) => (
        <Card style={styles.row} onPress={() => router.push(`/career/${item.id}`)} accessibilityLabel={item.title}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSub} numberOfLines={2}>
              {item.summary}
            </Text>
            <View style={styles.rowMeta}>
              <Badge label={`${t('explore.demand')}: ${item.demandOutlook}`} color={DEMAND_COLORS[item.demandOutlook]} />
            </View>
          </View>
          <FavouriteButton kind="careers" id={item.id} />
        </Card>
      )}
    />
  );
}

function QualificationList({ query, filter, setFilter }: { query: string; filter: string | null; setFilter: (v: string | null) => void }) {
  const { t } = useTranslation();
  const nqfOptions = ['NQF 5', 'NQF 6', 'NQF 7', 'NQF 8'];
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return qualifications.filter((qual) => {
      const matchesQuery = !q || qual.title.toLowerCase().includes(q) || qual.field.toLowerCase().includes(q);
      const matchesFilter = !filter || `NQF ${qual.nqfLevel}` === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<FilterRow options={nqfOptions} active={filter} onSelect={setFilter} />}
      ListEmptyComponent={<EmptyState message={t('explore.noResults')} />}
      contentContainerStyle={styles.list}
      renderItem={({ item }: { item: Qualification }) => (
        <Card style={styles.row} onPress={() => router.push(`/qualification/${item.id}`)} accessibilityLabel={item.title}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSub} numberOfLines={2}>
              {item.summary}
            </Text>
            <View style={styles.rowMeta}>
              <Badge label={`NQF ${item.nqfLevel}`} color={colors.primary} />
              <Badge label={item.type} color={colors.info} />
            </View>
          </View>
          <FavouriteButton kind="qualifications" id={item.id} />
        </Card>
      )}
    />
  );
}

function ProviderList({ query, filter, setFilter }: { query: string; filter: string | null; setFilter: (v: string | null) => void }) {
  const { t } = useTranslation();
  const provinceOptions = Array.from(new Set(providers.map((p) => p.province))).sort();
  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return providers.filter((p) => {
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q);
      const matchesFilter = !filter || p.province === filter;
      return matchesQuery && matchesFilter;
    });
  }, [query, filter]);

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<FilterRow options={provinceOptions} active={filter} onSelect={setFilter} />}
      ListEmptyComponent={<EmptyState message={t('explore.noResults')} />}
      contentContainerStyle={styles.list}
      renderItem={({ item }: { item: Provider }) => (
        <Card style={styles.row} onPress={() => router.push(`/provider/${item.id}`)} accessibilityLabel={item.name}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>{item.name}</Text>
            <Text style={styles.rowSub}>
              {item.city}, {item.province}
            </Text>
            <View style={styles.rowMeta}>
              <Badge label={item.type} color={colors.primary} />
              {item.offersDistance && <Badge label={t('explore.distance')} color={colors.success} />}
            </View>
          </View>
          <FavouriteButton kind="providers" id={item.id} />
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  segment: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, paddingBottom: spacing.sm },
  searchWrap: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  list: { padding: spacing.md, paddingTop: 0, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  rowTitle: { ...typography.label, fontSize: 16 },
  rowSub: { ...typography.caption, marginTop: 2 },
  rowMeta: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, flexWrap: 'wrap' },
});
