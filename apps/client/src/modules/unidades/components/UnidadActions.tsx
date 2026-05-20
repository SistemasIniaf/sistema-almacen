import { useState } from "react"
import {
  MoreHorizontalIcon,
  PencilIcon,
  PowerIcon,
  Trash2Icon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { UnidadEditDialog } from "./UnidadDialog"
import { useToggleUnidad, useDeleteUnidad } from "../hooks/useUnidadMutations"
import type { Unidad } from "../types/unidad.types"

interface UnidadActionsProps {
  unidad: Unidad
}

export function UnidadActions({ unidad }: UnidadActionsProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { mutate: toggle, isPending: isToggling } = useToggleUnidad()
  const { mutate: remove, isPending: isDeleting } = useDeleteUnidad()

  function handleDelete() {
    remove(unidad.id, { onSuccess: () => setDeleteOpen(false) })
  }

  return (
    <>
      {/* ── Dropdown ── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontalIcon />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <PencilIcon />
            Editar
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => toggle(unidad.id)}
            disabled={isToggling}
          >
            <PowerIcon />
            {unidad.activo ? "Desactivar" : "Activar"}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
            disabled={unidad._count.usuarios > 0}
          >
            <Trash2Icon />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Dialog editar ── */}
      <UnidadEditDialog
        unidad={unidad}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      {/* ── Dialog confirmar eliminación ── */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar unidad</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar{" "}
              <span className="font-medium text-foreground">
                {unidad.nombre}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
