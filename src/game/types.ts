export interface LevelData {
    name: string;
    theme: string;
    width: number;
    height: number;
    spawnPoint: { x: number; y: number };
    platforms: PlatformData[];
    enemies: EnemyData[];
    items: ItemData[];
    goal: { x: number, y: number };
    nextLevel?: string;
}

export interface PlatformData {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'ground' | 'platform';
}

export interface EnemyData {
    type: 'clone';
    x: number;
    y: number;
}

export interface ItemData {
    type: 'red_bone' | 'blue_bone' | 'combo_bone' | 'life_bone';
    x: number;
    y: number;
}
