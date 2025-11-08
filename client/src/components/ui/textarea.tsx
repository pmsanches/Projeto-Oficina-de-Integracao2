"use client"

import { useDialogComposition } from "@/components/ui/dialog"
import { useComposition } from "@/hooks/useComposition"
import { cn } from "@/lib/utils"
import type * as React from "react"

function Textarea({
  className,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: React.ComponentProps<"textarea">) {
  // Obtém o contexto de composição do diálogo se disponível (será no-op se não estiver dentro de Dialog)
  const dialogComposition = useDialogComposition()

  // Adiciona manipuladores de eventos de composição para suportar editor de método de entrada (IME) para idiomas CJK.
  const {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  } = useComposition<HTMLTextAreaElement>({
    onKeyDown: (e) => {
      // Verifica se esta é uma tecla Enter que deve ser bloqueada
      const isComposing = (e.nativeEvent as any).isComposing || dialogComposition.justEndedComposing()

      // Se a tecla Enter for pressionada durante a composição ou logo após o término da composição,
      // não chama o onKeyDown do usuário (isso bloqueia a lógica de negócio)
      // Nota: Para textarea, Shift+Enter ainda deve funcionar para novas linhas
      if (e.key === "Enter" && !e.shiftKey && isComposing) {
        return
      }

      // Caso contrário, chama o onKeyDown do usuário
      onKeyDown?.(e)
    },
    onCompositionStart: (e) => {
      dialogComposition.setComposing(true)
      onCompositionStart?.(e)
    },
    onCompositionEnd: (e) => {
      // Marca que a composição acabou de terminar - isso ajuda a lidar com a tecla Enter que confirma a entrada
      dialogComposition.markCompositionEnd()
      // Atrasa a definição de composing para false para lidar com a ordem de eventos do Safari
      // No Safari, compositionEnd dispara antes do evento keydown ESC
      setTimeout(() => {
        dialogComposition.setComposing(false)
      }, 100)
      onCompositionEnd?.(e)
    },
  })

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

export { Textarea }
