type WsLike = { send: (data: string) => void; close: () => void };

class WsHub {
  private rooms = new Map<string, Set<WsLike>>();

  join(conversationId: string, ws: WsLike) {
    if (!this.rooms.has(conversationId)) {
      this.rooms.set(conversationId, new Set());
    }
    this.rooms.get(conversationId)!.add(ws);
  }

  leave(conversationId: string, ws: WsLike) {
    this.rooms.get(conversationId)?.delete(ws);
  }

  leaveAll(ws: WsLike) {
    for (const [, clients] of this.rooms) {
      clients.delete(ws);
    }
  }

  broadcast(conversationId: string, payload: unknown) {
    const data = JSON.stringify(payload);
    for (const ws of this.rooms.get(conversationId) ?? []) {
      try {
        ws.send(data);
      } catch {
        /* client gone */
      }
    }
  }
}

export const wsHub = new WsHub();
