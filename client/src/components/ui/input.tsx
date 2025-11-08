"use client"

import { useDialogComposition } from "@/components/ui/dialog"
import { useComposition } from "@/hooks/useComposition"
import { cn } from "@/lib/utils"
import type * as React from "react"

function Input({
  className,
  type,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: React.ComponentProps<"input">) {
  // Obtém o contexto de composição do diálogo se disponível (será no-op se não estiver dentro de Dialog)
  const dialogComposition = useDialogComposition()

  // Adiciona manipuladores de eventos de composição para suportar editor de método de entrada (IME) para idiomas CJK.
  const {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  } = useComposition<HTMLInputElement>({
    onKeyDown: (e) => {
      // Verifica se esta é uma tecla Enter que deve ser bloqueada
      const isComposing = (e.nativeEvent as any).isComposing || dialogComposition.justEndedComposing()

      // Se a tecla Enter for pressionada durante a composição ou logo após o término da composição,
      // não chama o onKeyDown do usuário (isso bloqueia a lógica de negócio)
      if (e.key === "Enter" && isComposing) {
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
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      {...props}
    />
  )
}

export { Input }
