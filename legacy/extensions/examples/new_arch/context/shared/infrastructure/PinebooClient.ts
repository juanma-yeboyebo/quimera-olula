export class PinebooClient {
  static getClient(): PinebooClient {
    return new PinebooClient();
  }

  async getOne<T>(url: string): Promise<T | null> {
    const response = await this.get(url);

    if (!response?.data?.length) {
      return null;
    }

    return response.data[0];
  }

  async getMany<T>(url: string): Promise<T[]> {
    const response = await this.get(url);

    if (!response?.data) {
      return [];
    }

    return response.data;
  }

  async updateOne<T>(url: string, data: T): Promise<void> {
    await this.put(url, data);
  }

  async updateMany<T>(url: string, data: T[]): Promise<void> {
    await this.put(url, data);
  }

  private async get(url: string) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        "Authorization": `Token ${import.meta.env.VITE_API_TOKEN}`,
      },
    });

    const json = await response.json();

    return json;
  }

  private async put<T>(url: string, _data: T): Promise<void> {
    const _response = await fetch(url, {
      method: "PUT",
    });
  }
}
