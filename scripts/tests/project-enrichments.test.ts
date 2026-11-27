import assert from 'node:assert/strict';
import test from 'node:test';
import { enrichProject } from '../../src/lib/project-enrichments';
import type { Project } from '../../src/types';

const project = (slug: string): Project => ({
  id: 'fixture', title: 'Fixture', slug, category: 'Other', short_description: '',
  cover_url: '', tags: [], tech_stack: [], blocks: [{ id: 'original', type: 'paragraph', content: 'Original' }],
  demo_url: '', github_url: '', live_url: '', featured: false, published: true,
  display_order: 0, created_at: '', updated_at: '',
});

test('adds illustrated code blocks to both projects without mutating the CMS data', () => {
  for (const slug of ['roots-jeu-3d-unity', 'jardin-des-cristaux-vr']) {
    const original = project(slug);
    const enriched = enrichProject(original);
    assert.equal(original.blocks.length, 1);
    assert.equal(enriched.blocks[0], original.blocks[0]);
    assert.ok(enriched.blocks.some((b) => b.type === 'image'));
    assert.ok(enriched.blocks.some((b) => b.type === 'code' && b.meta?.language === 'csharp'));
    assert.equal(new Set(enriched.blocks.map((b) => b.id)).size, enriched.blocks.length);
    assert.equal(enrichProject(enriched), enriched);
  }
});

test('saved editorial changes and removals take precedence once the marker is persisted', () => {
  const enriched = enrichProject(project('roots-jeu-3d-unity'));
  const edited = { ...enriched, cover_url: '/custom.png', blocks: enriched.blocks.filter((b) => b.type !== 'code') };
  assert.equal(enrichProject(edited), edited);
});

test('leaves other projects and existing covers unchanged', () => {
  const other = project('le-classeur');
  assert.equal(enrichProject(other), other);
  const roots = { ...project('roots-jeu-3d-unity'), cover_url: '/existing.png' };
  assert.equal(enrichProject(roots).cover_url, '/existing.png');
});
