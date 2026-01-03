"use client";

import React from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
import { FiX, FiPlus } from "react-icons/fi";

interface Props {
    open: boolean;
    onClose: () => void;
    data: any;
}

export default function ProductSideDrawer({ open, onClose, data }: Props) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: 520,
                    p: 2,
                },
            }}
        >
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Data details</Typography>
                <IconButton onClick={onClose}>
                    <FiX />
                </IconButton>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* DATA INFO */}
            <Section title="Data info">
                <ReadOnly label="Specification" value={data?.specification} />
                <ReadOnly label="Unit" value={data?.unit} />
                <ReadOnly label="Price" value={data?.price} />
                <ReadOnly label="Member Price" value={data?.memberPrice} />
                <ReadOnly label="Origin" value={data?.origin} />
                <ReadOnly label="Name" value={data?.Title} />
            </Section>

            {/* IMAGE INFO */}
            <Section title="Image info" action={<FiPlus />}>
                <Button variant="outlined" component="label">
                    Upload Image
                    <input hidden type="file" accept="image/*" />
                </Button>
            </Section>

            {/* ICON INFO */}
            <Section title="Icon info" />

            {/* VIDEO INFO */}
            <Section title="Video info" action={<FiPlus />}>
                <Button variant="outlined" component="label">
                    Upload Video
                    <input hidden type="file" accept="video/*" />
                </Button>
            </Section>

            {/* CAROUSEL INFO */}
            <Section title="Carousel info" />

            {/* BIND ESL */}
            <Section title="Bind ESL">
                <MiniTable />
            </Section>

            {/* BIND LCD */}
            <Section title="Binding LCD">
                <MiniTable />
            </Section>

            {/* SAVE */}
            <Box mt={3}>
                <Button
                    fullWidth
                    size="large"
                    sx={{ bgcolor: "#262262", color: "white" }}
                >
                    Save
                </Button>
            </Box>
        </Drawer>
    );
}

/* ---------- Helpers ---------- */

const Section = ({
                     title,
                     children,
                     action,
                 }: {
    title: string;
    children?: React.ReactNode;
    action?: React.ReactNode;
}) => (
    <Box mb={3}>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
            sx={{ bgcolor: "#F5F5F7", p: 1.5, borderRadius: 2 }}
        >
            <Typography fontWeight={600}>{title}</Typography>
            {action && <IconButton>{action}</IconButton>}
        </Box>
        {children}
    </Box>
);

const ReadOnly = ({ label, value }: { label: string; value?: string }) => (
    <Box mb={1}>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
        <Typography>{value || "-"}</Typography>
    </Box>
);

const MiniTable = () => (
    <Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>Mac address</TableCell>
                <TableCell>Template</TableCell>
                <TableCell>Operate</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell colSpan={3} align="center">
                    No Data
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
);
