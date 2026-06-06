export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  permissions: string[];
  entryPoint: string;
}

export type PluginState = 'installed' | 'enabled' | 'disabled' | 'error';

export interface PluginInstance {
  manifest: PluginManifest;
  state: PluginState;
  instance?: any; // The instantiated plugin class/module
  error?: string;
}

/**
 * Enterprise Plugin Registry
 * Handles dynamic loading, lifecycle, and permissions of third-party extensions.
 */
class PluginRegistryService {
  private plugins: Map<string, PluginInstance> = new Map();

  async install(manifest: PluginManifest, sourceUrl: string): Promise<void> {
    console.log(`[PluginRegistry] Installing plugin ${manifest.name} from ${sourceUrl}`);
    this.plugins.set(manifest.id, {
      manifest,
      state: 'installed'
    });
    // Simulate fetching and parsing
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async enable(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error('Plugin not found');
    
    console.log(`[PluginRegistry] Enabling plugin ${plugin.manifest.name}`);
    plugin.state = 'enabled';
    // Initialize plugin entry point here
    this.plugins.set(pluginId, plugin);
  }

  async disable(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) throw new Error('Plugin not found');

    console.log(`[PluginRegistry] Disabling plugin ${plugin.manifest.name}`);
    plugin.state = 'disabled';
    // Teardown plugin here
    this.plugins.set(pluginId, plugin);
  }

  async remove(pluginId: string): Promise<void> {
    console.log(`[PluginRegistry] Removing plugin ${pluginId}`);
    this.plugins.delete(pluginId);
  }

  getPlugins(): PluginInstance[] {
    return Array.from(this.plugins.values());
  }
}

export const PluginRegistry = new PluginRegistryService();
