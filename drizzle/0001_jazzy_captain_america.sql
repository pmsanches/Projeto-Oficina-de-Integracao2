CREATE TABLE `alunos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(255) NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alunos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alunoId` int NOT NULL,
	`oficinaId` int NOT NULL,
	`descricao` text,
	`cargaHoraria` int NOT NULL,
	`dataEmissao` timestamp NOT NULL DEFAULT (now()),
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certificados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oficina_alunos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`oficinaId` int NOT NULL,
	`alunoId` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `oficina_alunos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oficina_professores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`oficinaId` int NOT NULL,
	`professorId` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `oficina_professores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oficina_tutores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`oficinaId` int NOT NULL,
	`tutorId` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `oficina_tutores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `oficinas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`temaId` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `oficinas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `professores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cargo` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(255) NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `professores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `temas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titulo` varchar(255) NOT NULL,
	`descricao` text,
	`cargaHoraria` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `temas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tutores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`telefone` varchar(20),
	`email` varchar(255) NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tutores_id` PRIMARY KEY(`id`)
);
